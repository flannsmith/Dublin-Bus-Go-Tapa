from django.shortcuts import render
from django.http import HttpResponse
from django.db import models
from dublinBus.models import *
from django.http import JsonResponse
from dbanalysis.network import linear_network
from dbanalysis.stop_tools import stop_getter
network = linear_network.bus_network()
s_getter = stop_getter()
import datetime

def about(request):
    return render(request,'about.html',{})

def map_reader(request):
    return render(request, 'busmap.html',{})

def heatmap(request):
    return render(request, 'heatmap.html',{})

def get_routes(request):
    all_routes=list(Routes.objects.values())
    #print(type(all_entries))
    return JsonResponse(all_routes, safe=False)

def dummy(request,day,week):

    d={'day':day,'week':week}
    return JsonResponse(d,safe=False)

def get_stops(request):
    global network
    stops = network.get_all_stops()
    return JsonResponse(stops, safe=False)

def get_route_variation(request,routename,v):
    print(routename,v)
    global network
    route = network.get_route(routename,variation=v)
    return JsonResponse(route,safe=False)
def get_route(request,routename):
    print(routename)
    global network
    routes = network.get_route(routename,all_variations=True)
    return JsonResponse(routes,safe=False)
def get_RTPI(request,stop):
    global network
    info = network.get_RTPI(stop)
    return JsonResponse(info,safe=False)

def get_timetable(request,stop):
    global network
    #get the date time at midnight
    dt = datetime.datetime.now().replace(hour=0,minute=0,microsecond=0)
    df = network.nodes[str(stop)].timetable.get_all_times()
    d = []
    for row in df.itertuples():
        obj = {}
        obj['arrive']=(dt+datetime.timedelta(0,row[1])).time()
        obj['arrive_next']=(dt + datetime.timedelta(0,row[2])).time()
        obj['link'] = row[6]
        obj['route'] = row[7]
        d.append(obj)
    return JsonResponse({str(stop):d},safe=False)

def get_shape(request, stop, link):
    stop=str(stop)
    link=str(link)
    global s_getter
    obj = {'stop':stop,'link':link,'shape':s_getter.get_shape(stop,link)}
    if obj['shape'] == None:
        return JsonResponse({'error':'invalid link'},safe=False)
    return JsonResponse(obj, safe=False)

def get_route_shape(request,routename,vari=0):
    global network
    global s_getter
    #the first element is always a word, so we have to cut that out here..
    route = network.get_route(routename,variation=vari)
    if route == None:
        return JsonResponse({'error':'invalid route'},safe=False)
    route=[str(r) for r in route ][1:]
    print(route)
    coords = []
    stops = []
    for i in range(0, len(route)-1):
        try:
            stops.append({'stop_id':route[i],'coords':s_getter.get_stop_coords(route[i])})
            coords += s_getter.get_shape(route[i],route[i+1])
        except:
            coords.append({'err':'missing link'})
    stops.append({'stop_id':route[-1],'coords':s_getter.get_stop_coords(route[-1])})
    obj = {'route':routename, 'stops':stops,'shape':coords}
    return JsonResponse(obj, safe=False)
