import traceback
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordChangeForm
from django.contrib.auth import login, logout, get_user, authenticate
from django import forms
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, HttpResponseRedirect
from django.http import HttpResponse
from django.db import models
from dublinBus.models import *
from django.http import JsonResponse
import haversine
from math import inf
from threading import Thread
from django.contrib.auth.models import User
import pickle
import os
import time
import datetime
from django.db.models.aggregates import Max
from django.contrib import messages
CREATE_NETWORK = False
LOAD_NETWORK = True
def network_updater():
    """
    Function for loading updated network timetables. Run as thread. Will try to reload new time tables at about
    2am in the morning
    """
    global network
    with open('dublinBus/static/timetabledump.bin','rb') as handle:
        network.nodes = pickle.load(handle)
        network.prepare_dijkstra()
        network.properly_add_foot_links()
    handle.close()
    while True:
        now = datetime.datetime.now()
        seconds = (now - now.replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds()
        if seconds < 8000:
            time.sleep(8000-seconds)
        elif seconds > 8000:
            time.sleep((3600*24) - seconds + 8000)
        else:
            pass
        
        with open('dublinBus/static/timetabledump.bin','rb') as handle:
            
            
            network.nodes = pickle.load(handle)
            network.prepare_dijkstra()
            network.properly_add_foot_links()
        handle.close()
        time.sleep(300)
#Either create the network object from scratche
if CREATE_NETWORK:
    #this is never used. We always have it set to load.
    network = simple_network2.simple_network()
    network.generate_time_tables()
    for node in network.nodes:
        try:
            network.nodes[node].timetable.concat_and_sort()
        except:
            pass
    import pickle
    with open('simple_network_concated','wb') as handle:
        pickle.dump(network,handle,protocol=pickle.HIGHEST_PROTOCOL)
#Or load it from disk
elif LOAD_NETWORK:
    from dbanalysis.network import simple_network4
    network = simple_network4.simple_network(build=False)
    updater = Thread(target = network_updater)
    updater.start()
    #with open('simple_network_concated','rb') as handle:
    #    network = pickle.load(handle)
    #    network.prepare_dijkstra()
#updater = Thread(target=network_updater)
#updater.start()
#from rest_framework.authentication import SessionAuthentication, BasicAuthentication
#from rest_framework.permissions import IsAuthenticated
#from rest_framework.response import Response
#from rest_framework.views import APIView
#from accounts.form import PasswordChangeForm


import datetime
def dummyfloat(request,origin_Lat,origin_Lon,destination_Lat,destination_Lon):
    
    return JsonResponse({'number':destination_Lat},safe=False)

#Home page loads only if the user is logged in 
@login_required(login_url="/")
def about(request):
    """
    Return main .html
    """
    return render(request,'about.html',{})

def journeyPlanner(request):
    return render(request,'journeyPlanner.html',{})

def map_reader(request):
    """
    Created in first two weeks of project. Still loads.
    """
    return render(request, 'busmap.html',{})

def heatmap(request):
    """ 
    Created in first two weeks of project. Still loads.
    """
    return render(request, 'heatmap.html',{})

def get_routes(request):
    all_routes=list(Routes.objects.values())
    #print(type(all_entries))
    return JsonResponse(all_routes, safe=False)

def dummy(request,day,week):
    """
    Used to prove that the server was working
    """
    d={'day':day,'week':week}
    return JsonResponse(d,safe=False)

def get_stops(request):
    """
    Hopefully unused method
    """
    global network
    stops = network.get_all_stops()
    return JsonResponse(stops, safe=False)

def get_route_variation(request,routename,v):
    """
    Unused
    """
    global network
    route = network.get_route(routename,variation=v)
    return JsonResponse(route,safe=False)
def get_route(request,routename):
    """
    Unused
    """
    global network
    routes = network.get_route(routename,all_variations=True)
    return JsonResponse(routes,safe=False)
def get_RTPI(request,stop):
    """
    Method was never used.
    """
    global network
    info = network.get_RTPI(stop)
    return JsonResponse(info,safe=False)

def get_timetable(request,stop):
    """
    Return the timetable for a requested stop.
    Translates it from pandas to json format.
    I think this is deprecated.
    """
    global network
    #get the date time at midnight
    dt = datetime.datetime.now()
    try:
        d = network.get_stop_time_table(str(stop),dt)
        if d is None or len(d) == 0:
            return JsonResponse({'timetable':d,'error':True},safe=False)
        else:
            return JsonResponse({'timetable':d,'error':False},safe=False)
    except:
        return JsonResponse({'timetable':[],'error':True},safe=False)
def get_shape(request, stop, link):
    """
    Gets a list of coordinates between two stops.
    Stop A is 'stop', and stop B is 'link'
    """
    stop=str(stop)
    link=str(link)
    global network
    obj = {'stop':stop,'link':link,'shape':network.s_getter.get_shape(stop,link)}
    if obj['shape'] == None:
        return JsonResponse({'error':'invalid link'},safe=False)
    return JsonResponse(obj, safe=False)

def get_route_shape(request,routename,vari=0,api_response=True):
    """
    Returns all of the coordinates for the shape of an entire route.
    """
    global network
    
    #the first element is always a word, so we have to cut that out here..
    route = network.selector.routes[routename][vari]
    if route == None:
        return JsonResponse({'error':'invalid route'},safe=False)
    route=[str(r) for r in route ][1:]
    coords = []
    stops = []
    # for every stop in the route, add the stop to the stops array. Get the shape, and add it to the coordinates array
    for i in range(0, len(route)-1):
        try:
            stops.append({'stop_id':route[i],'coords':network.s_getter.get_stop_coords(route[i])})
            coords += network.s_getter.get_shape(route[i],route[i+1])
        except:
            coords.append({'err':'missing link'})
    stops.append({'stop_id':route[-1],'coords':network.s_getter.get_stop_coords(route[-1])})
    obj = {'route':routename, 'stops':stops,'shape':coords}
    
    return JsonResponse(obj, safe=False)

def closest_stops(request,lat,lon):
    """
    Uses the stop finder class to find the closest (haversine distance) stop to a given lat/lon
    This isn't used. Replaced with a method at the bottom of the file.
    """
    global network
    resp = network.stop_finder.find_closest_stops(lat,lon)
    return JsonResponse(resp,safe=False)

def djikstra(request, origin,destination,starttime):
    """
    Redundant method
    """
    return JsonResponse({'err':'function is redundant'})


def test_dijkstra(request):
    """
    Deprecated
    """
    return dijkstra2(30000,53.3660,-6.2045,53.2822,-6.3162, text_response=True)

def dijkstra2(request,origin_Lat,origin_Lon,destination_Lat, destination_Lon,day,starttime=30000, text_response = True,return_shape=False):
    """
    Find the user a route using the network object
    """
    try:
        #we were unable to write django urls with negative floats, so this just automatically corrects all of the longitudes.
        # We should have solved this problem by now :(
        origin_Lat = float(origin_Lat)
        origin_Lon = float(origin_Lon)
        starttime = float(starttime)
        day = int(float(day))
        if origin_Lon > 0:
            origin_Lon = origin_Lon*-1
        destination_Lat = float(destination_Lat)
        destination_Lon = float(destination_Lon)
        if destination_Lon > 0:
            destination_Lon = destination_Lon * -1
    
        global network
        # get response from the network object and return it.
        resp=network.dijkstra(day,starttime,origin_Lat,origin_Lon,destination_Lat,destination_Lon)
        if resp is None:
            return JsonResponse({'error':True,'error-type':'No solution found'},safe=False)
        resp['shapes'] = network.dijkstra_shape(resp['data'])
        resp['data'] = resp['stop_markers']
        resp['error'] = False
        return JsonResponse(resp,safe = False)
    except Exception as e:
        #there is a lingering error and sometimes, but very rarely, it just breaks alltogether.
        #This is the unsatisfactory solution.. 
        resp = {'error':True,'error-type':str(e)}
        return JsonResponse(resp,safe=False)

#This view is to log the users in 
def login_view(request):
    """
    Logs a user in
    """
    if request.method == 'POST':
       form=AuthenticationForm(data=request.POST)
       if form.is_valid():
           user=form.get_user()
           login(request,user)
           
           return redirect('dublinBus:home_page')
       else:
            #form=AuthenticationForm()
            
            messages.error(request,'Invalid username or password. Please try again')
            return redirect('dublinBus:login')
           # return render(request, 'login.html', {'form': form}, {'invalid': 'invalid'})
    else:
        form=AuthenticationForm()
    return render(request, 'login.html',{'form': form}, {'invalid': 'invalid'})

#This view is to sign-up users 
def signup_view(request):
    """
    Returns the signup html form
    """    
    if request.method == 'POST':
        form=UserCreationForm(request.POST)
        #username=request.POST['Username']
        if form.is_valid():
            user=form.save()
            login(request,user)
            newUser=Userpoints(user_id=request.user, dublin_bus_points=0, distance_travelled_on_DublinBus=0)
            newUser.save()
            return redirect('dublinBus:home_page')
    else:
       form = UserCreationForm() 
    return render(request, 'signup.html',{'form': form})

#This viw to log users out. 
@login_required(login_url="/")
def logout_view(request):
    """
    Logs the user out and redirects them to the homepage
    """
    logout(request)
    #form=AuthenticationForm()
    #return redirect('dublinBus:login')
    #return render(request, 'login.html',{'form': form})
    return HttpResponseRedirect("/")
#This view is for the users to change their password. But its not fully ready yet
def change_password_view(request):
    """
    Changes the user's password
    """
    user = User.objects.filter(id=3306)
    user.delete()
    if request.method=='POST':
        form = PasswordChangeForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('dublinBus:home_page')
    else:
        form=PasswordChangeForm(instance=request.user)
        return render(request, 'change_password.html', {'form':form})
    
#View to display calendar and time of entry
def user_favourites(request, loc_address, loc_name):
    """
    Unused
    """
    #if request.user.is_authenticated:
    username=request.user

    fav=UserFavourites(user_id=username, location_address=loc_address, location_name=loc_name)
    fav.save()
    return HttpResponse(status=200)

def user_location(request, origin_Lat, origin_Lon):
    """
    Method for receiving user's location, validating that they are using dublin bus wifi, and saving the location to award future points.
    """
    #if request.user.is_authenticated:
    import time
    import datetime
    # get the ip address forwarded by nginx
    ip = request.META.get('HTTP_X_FORWARDED_FOR')
    
    #return JsonResponse({'user':request.user.id, 'lat':origin_Lat, 'lon':origin_Lon},safe=False)
    try:

        #split the array
        arr = ip.split('.')
        onDublinBus=False
        #check if ip matches known dublin bus prefixes.
        # This should be replaced with a list, or a regex
        if (arr[0] =='83' and arr[1] == '136' and arr[2] == '43') or \
             (arr[0] == '80' and arr[1] == '233' and arr[2] == '63'):
            onDublinBus=True
         #onDublinBus=True  
        if onDublinBus:
            #if it matches, save the user's location in the points database
            timeStamp = datetime.datetime.now()
            username=User.objects.get(id=str(request.user.id))
            ulocation=Userlocation(user_id=username, user_lat=origin_Lat, user_lon=origin_Lon, insert_timestamp=timeStamp)
            ulocation.save()
            f=open('/data/nginxsucceslog','a')
            f.write('\nsuccess '+str(username.username))
            f.close()
            return HttpResponse(status=200)
        return HttpResponse(status=204)
    except Exception as e:
        #write an error on file. Used to debug whatever nginx is up to.
        f=open('/data/nginxerrorlog.log','a')
        f.write(str(e))
        f.close()
         #user_details=Userpoints.objects.filter(user_id=request.user.id)
         #for user in user_details:
         #   user.dublin_bus_points+=1
         #   print(user.dublin_bus_points)
         #   user.save()
#     except:
        return HttpResponse(status=204)

def get_ip(request):
    """
    Used to check the ip that nginx receives. 
    Important, because on Dublin bus at least, nginx seems to receive a slightly different ip to what google told us
    This method saved us :)
    """
    import json
    
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    arr=x_forwarded_for.split('.')
#     user =    
    resp = {'mssg':x_forwarded_for,'user':request.user.id,'array':arr}
    return JsonResponse(resp,safe=False)


def request_dublin_bus_points(request,lat,lon):
    """
    Deprecated
    """
    ip = request.META.get('HTTP_X_FORWARDED_FOR')
    arr = ip.split('.')
    if arr[0] == '80' and arr[1] == '233' and arr[2] == '32':
        on_dublin_bus_wifi = True
    else:
        on_dublin_bus_wifi = False

    if on_dublin_bus:
        points=Userpoints(user=request.user.user_id, dublin_bus_points=10)
        points.save()
        # save their location
    else:
        pass
        # don't award points
        # still save their location?
        
def get_all_routes(request):
    """
    Gets all of the routes available
    """
    global network
    return JsonResponse(network.selector.return_all_routes(),safe=False)
def get_variations(request,route):
    """
    Gets a list of all the different variations in a route
    """
    data = network.selector.return_variations(str(route))
    if data is None:
        resp = {'error':True,'error-type':'invalid route'}
    else:
        resp = {'error':False,'data':data}
    return JsonResponse(resp,safe=False)
def get_stops_in_route(request,route,variation):
    """
    Gets a list of all of the stops in a route.
    """
    global network
    
    try:           
        return JsonResponse(network.selector.stops_in_route(route,int(variation)),safe=False)
    except:
         return JsonResponse({'error':True,'error-type':'route unavailable'})

def get_routes_serving_stop(request,stop):
    """
    Returns the shape pattern for all routes that serve a given stop

    """
    try:
        routes_serving = network.stop_getter.get_stop_info(str(stop))['serves']
        response = []
        color_count = 0
        colors = ['blue','red','yellow','green','purple','pink','orange','indigo','cyan']
        for route in routes_serving:
            for variation in routes_serving[route]:
                try:
                    
                    array = network.selector.routes[route][variation][1:]
                    stopB = str(array[-1])
                    resp1 = resp1 = network.stop_getter.get_shape_route(stop,stopB,array)
                    stopA = network.stop_getter.get_stop_coords(str(stop))
                    stopB = network.stop_getter.get_stop_coords(str(stopB))
                    shape = [{'lat':i['lat'],'lng':i['lon']} for i in resp1['shape']]
                    if len(resp1['shape']) > 0:
                        response.append({'stops':[stopB],'distance':resp1['distance'],\
                                        'colors':colors[color_count],'shape':shape})
                    color_count += 1
                    if color_count == len(colors):
                        color_count = 0
                except:
                    pass
        return JsonResponse({'data':response,'begin_stop':stopA,'error':False,},safe=False)
    except Exception as e:
        return JsonResponse({'error':True,'error_type':str(e)},safe=False)

def get_route_shape(request,route,variation,stopA,stopB,api_response=False):
    """
    Gets the entire shape (coordinates) or a route variation
    """
    global network
    try:
        route_array = network.selector.routes[route][int(variation)][1:]

        resp1=network.stop_getter.get_shape_route(stopA,stopB,route_array)
        stopA = network.stop_getter.get_stop_coords(str(stopA))
        stopB = network.stop_getter.get_stop_coords(str(stopB))
        resp = {'stops':[stopA,stopB],'distance':resp1['distance'],'shape':resp1['shape'],'error':False}
    except Exception as e:
        resp = {'error':True,'error-type':str(e)}
    return JsonResponse(resp,safe=False)

def routes_serving_stop(request,stop):
    """
    Unused
    """
    global network
    data = network.stop_getter.routes_serving_stop(stop)
    if data is None:
        return JsonResponse({'error':True},safe=False)
    else:
        return JsonResponse({'data':network.s_getter.routes_serving_stop(stop),'error':False},safe=False)
    

def single_predict(request,day,route,vnum,stopA,stopB,time):
    """
    Gets estimated departure time from stopA, and estimated arrival time at stop B
    """
    global network
    try:
        arrival_time,departure_time = network.quick_predict(int(day),str(route),int(vnum),str(stopA),str(stopB),int(time))
        travel_time = arrival_time - departure_time
        total_hours = travel_time // 3600
        total_minutes = (travel_time % 3600) // 60
        arrivaldt = str(datetime.timedelta(seconds=arrival_time))
        return JsonResponse({'travel time':{'hours':total_hours,'minutes':total_minutes},'arrival time':arrivaldt,'error':False,\
                            'departure time':str(datetime.timedelta(seconds=departure_time))},safe=False)
    
   
    except Exception as e:
        print(e)
        return JsonResponse({'travel time':None,'arrival time':None,'error':True,'error-type':str(e)},safe=False)
def closest_stops(request,lat,lon):
    """
    Find the closest stops to a given user location. 
    """
    global network
    lon = float(lon)
    lat = float(lat)
    if lon > 0:
        lon = lon * -1
    stops = network.stop_finder.find_closest_stops(lat,lon)
    if stops is None:
        resp = {'error':True}
        return JsonResponse(resp,safe=False)
    minimum = inf
    best_stop = None
    for stop in stops:
        if stop['distance']<minimum:
            minimum = stop['distance']
    resp = {'next_to_user':False,'stops':stops,'best_stop':best_stop,'error':False}
    if minimum < 0.1:
        resp['next_to_user'] = True
  
            
    return JsonResponse(resp,safe=False)

#get user details
def get_user_profile(request):
    """
    Get's details about the user's profile
    """
    username=request.user.username
    user_id=request.user.id
    u_points=Userpoints.objects.get(user_id_id=user_id).dublin_bus_points
    if u_points==0:
        user_message="Use Dublin Bus to save the environment. "
    else:
        user_message="Well Done for contributing in saving the planet. Keep using Dublin Bus!!"
    users_max_points=Userpoints.objects.order_by('-dublin_bus_points')[:5]

    leaderboard=[]
    for userid in users_max_points:
        username_leaderboard=User.objects.get(id=userid.user_id_id)
        leaderboard.append({'user': username_leaderboard.username, 'points':userid.dublin_bus_points,'distance_travelled':userid.distance_travelled_on_DublinBus})

    return JsonResponse({'username':username, 'points':u_points, 'leaderboard':leaderboard, 'user_message': user_message}, safe=False)        
#@authentication_classes((SessionAuthentication, BasicAuthentication))
#@permission_classes((IsAuthenticated,))
#def example_view(request, format=None):
#    content = {
#        'user': unicode(request.user),  # `django.contrib.auth.User` instance.
#        'auth': unicode(request.auth),  # None
#    }
#    print(content.user)
#    return Response(content)
