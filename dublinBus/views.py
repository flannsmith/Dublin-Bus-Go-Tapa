import traceback
from django.shortcuts import render
from django.http import HttpResponse
from django.db import models
from dublinBus.models import *
from django.http import JsonResponse
from dbanalysis.network import linear_network
from dbanalysis.stop_tools import stop_getter,stop_finder
import haversine
from math import inf
from threading import Thread
stop_finder = stop_finder()
network = linear_network.bus_network()
s_getter = stop_getter()
use_DJIKSTRA = False
graph_lock = False
load_DJIKSTRA = True
if use_DJIKSTRA:
    import heapq
    for n in network.nodes:
        network.nodes[n].back_links = []
        network.nodes[n].get_foot_links()
        network.nodes[n].all_links = set([i for i in network.nodes[n].get_links() if i in network.nodes] + [i for i in network.nodes[n].foot_links if i in network.nodes])
    
    import pickle
    with open('/home/student/networkpickle','wb') as handle:
        pickle.dump(network,handle,protocol=pickle.HIGHEST_PROTOCOL)
if load_DJIKSTRA:
    import pickle
    import heapq
    with open('/home/student/networkpickle','rb') as handle:
        network = pickle.load(handle)

import datetime
def dummyfloat(request,origin_Lat,origin_Lon,destination_Lat,destination_Lon):
    return JsonResponse({'number':destination_Lat},safe=False)

def about(request):
    return render(request,'about.html',{})

def journeyPlanner(request):
    return render(request,'journeyPlanner.html',{})

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

def closest_stops(request,lat,lon):
    global stop_finder
    resp = stop_finder.find_closest_stops(lat,lon)
    return JsonResponse(resp,safe=False)



def djikstra(request, origin,destination,starttime):
    """
    Run djikstra's algorithm on graph, using the predicted time tables.
    """
    global network
    origin = str(origin)
    destination=str(destination)
    g=network
    from math import inf
    for n in g.nodes:
        g.nodes[n].weight=inf
        g.nodes[n].back_links=[]
    current_node = origin
    g.nodes[origin].weight = starttime
    current_time = starttime
    visited = []
    to_visit = []
    heapq.heappush(tovisit,[0,current_node])
    count = 0
    while len(to_visit) > 0 and current_node != destination:
        #potential to run forever here, having changed to_visit into a heap
        node = g.nodes[current_node]
        links=g.nodes[current_node].all_links
        for link in links:
            if link in g.nodes[current_node].get_links() and\
                            hasattr(g.nodes[current_node].timetable,'data'):

                try:
                    time = g.nodes[current_node].timetable.get_next_departure(link,current_time)
                    if time < g.nodes[link].weight:
                        g.nodes[link].weight = time
                        g.nodes[link].back_links.append(current_node)
                        #what if the node is already in the heap?
                        #yes we're adding it with a better time --> but..?
                        heapq.heappush(to_visit,[time,link])
                            

                except:
                    pass

            elif link in g.nodes[current_node].foot_links:
                time = g.nodes[current_node].foot_links[link] + current_time
                if time < g.nodes[link].weight:
                    g.nodes[link].weight = time
                    g.nodes[link].back_links.append(current_node)
                    #difficulty here - we might be pushing nodes onto the
                    #heap that are already there
                    heapq.heappush(to_visit,[time,link])
                        

        
        minimum = inf
        current_node = None
        x = heapq.heappop(to_visit)
        current_time = x[0]
        current_node = x[1]

    weight = g.nodes[destination].weight
    cur_node = destination
    resp = []
    import json
    stops_dict = json.loads(open('/home/student/dbanalysis/dbanalysis/resources/stops_trimmed.json','r').read())
    #back track to find the shortest path
    while weight > starttime:
        minweight = inf
        for link in g.nodes[cur_node].back_links:
            if g.nodes[link].weight < minweight:
                minweight=g.nodes[link].weight
                new_curnode = link
                weight = minweight
        resp.append({new_curnode:stops_dict[new_curnode]})
        cur_node = new_curnode
        weight = minweight     
    
    return JsonResponse(resp,safe=False)

class dummy_stop():
    '''
    dummy user origin/destination  point that can behave like a stop
    '''
    def __init__(self):
        self.weight=0
        self.footlinks={}
        self.back_links=[]
        self.all_links=[]
        self.stop_id=None

def test_dijkstra(request):
    return dijkstra2(30000,53.3660,-6.2045,53.2822,-6.3162, text_response=True)

def dijkstra2(request,origin_Lat,origin_Lon,destination_Lat,destination_Lon,starttime=30000, text_response = True):
    """
    Djikstra, but with the user's location and destination coordinates as the
    
    start and end points

    This is mess code, sorry. I will try to rewrite it in a better form later.
    """
    origin_Lat = float(origin_Lat)
    origin_Lon = float(origin_Lon)
    starttime = float(starttime)
    if origin_Lon > 0:
        origin_Lon = origin_Lon*-1
    destination_Lat = float(destination_Lat)
    destination_Lon = float(destination_Lon)
    if destination_Lon > 0:
        destination_Lon = destination_Lon * -1
    
    global network
    global graph_lock
    global stop_finder
    from math import inf
    while graph_lock:
        #block if/while the graph is being cleared up
        pass

    o_stops = [s for s in \
            stop_finder.find_closest_stops(origin_Lat,origin_Lon) \
                    if s['stop_id'] in network.nodes]
    origin_stops = {}
    for stop in o_stops:
        stopid = stop['stop_id']
        distance = stop['distance']
        origin_stops[stopid]=distance/5

    d_stops  = [s for s in \
            stop_finder.find_closest_stops(destination_Lat,destination_Lon) \
                    if s['stop_id'] in network.nodes]
    destination_stops = {}
    for stop in d_stops:
        stopid = stop['stop_id']
        distance=stop['distance']
        destination_stops[stopid]=distance/5
       
    #add links to the destination stop to the graph
    print(destination_stops)
    
    for s in destination_stops:
        network.nodes[s].foot_links['end'] = destination_stops[s]
        network.nodes[s].all_links.add('end')
    #set the weight of all nodes to infinity
    for n in network.nodes:
        network.nodes[n].weight = inf         

    #create dummy stop nodes for the begining and origin
    origin=dummy_stop()
    origin.weight = starttime
    origin.foot_links = origin_stops
    origin.all_links=origin_stops
    destination = dummy_stop()
    destination.weight = inf
    network.nodes['begin'] = origin
    #add the origin stop to the graph
    network.nodes['end'] = destination
    current_node = 'begin'
    current_time = starttime
    visited = []
    to_visit = []
    count=0
    heapq.heappush(to_visit,[starttime,current_node])
    while len(to_visit) > 0 and current_node != 'end':
        node = network.nodes[current_node]
        links = network.nodes[current_node].all_links
        
        for link in links:
            if current_node != 'begin' and link in\
                network.nodes[current_node].get_links() and\
                hasattr(network.nodes[current_node].timetable, 'data'):
                        

                try:
                    count+=1
                    resp = network.nodes[current_node].timetable.get_next_departure(link,current_time)
                   
                    if resp is None:
                        continue
                    
                    time = resp['actualtime_arr_to']
                    route = resp['route']
                    
                    if time < network.nodes[link].weight:
                        network.nodes[link].weight = time
                        network.nodes[link].back_links.append([current_node,route,time])                   
                        heapq.heappush(to_visit,[time,link])

                except:
                    traceback.print_exc()
                    input()
                    

            elif link in network.nodes[current_node].foot_links:
                
                time = network.nodes[current_node].foot_links[link] + current_time
                if time < network.nodes[link].weight:
                    network.nodes[link].weight = time
                    #append a 'w' for route id as this is a walking link
                    network.nodes[link].back_links.append([current_node,'w',time])
                    heapq.heappush(to_visit,[time,link])


        #remove the next node from the bottom of the heap
        x = heapq.heappop(to_visit)
        current_time = x[0]
        current_node = x[1]
    
    #retrace path to get the quickest route
    weight = network.nodes['end'].weight
    cur_node = 'end'
    resp = [{'id':'end', 'route':'walking', 'data':\
                {'lat':destination_Lat,\
                'lon':destination_Lon,\
                'stop_name':'destination'}}]
    import json
    stops_dict = json.loads(open('/home/student/dbanalysis/dbanalysis/resources/stops_trimmed.json','r').read())
    while weight > starttime:
        minweight = inf
        
        for link in network.nodes[cur_node].back_links:
            stop_id = link[0]
            if network.nodes[stop_id].weight < minweight:
                minweight = network.nodes[stop_id].weight
                new_curnode = stop_id
                route = link[1]
                if route == 'w':
                    route = 'walking'
                weight = minweight
        if new_curnode != 'begin':
            resp.append({'data':stops_dict[new_curnode],\
            'id':new_curnode,\
            'route':route,\
            'time':weight})
        else:
            resp.append({'id':'begin','data':\
            {'lat':origin_Lat, 'lon':origin_Lon,'stop_name':'origin'},\
            'route':'walking',\
            'time':starttime})
        cur_node = new_curnode
        weight = minweight


    if text_response:
        #put together a readable version of the response data
        text=[]
        current_route = 'walking'
        current_stop = resp[-1]
        time = current_stop['time']
        for i in range(len(resp)-2,-1,-1):
            if resp[i]['route'] != current_route:
                
                if current_route == 'walking':
                    text.append('Walk from '+\
                                current_stop['data']['stop_name']\
                                + ' to '\
                                + resp[i]['data']['stop_name']\
                                +'.'+\
                                str((resp[i]['time']-time)//60)+\
                                ' minutes')
                 
                
                else:
                    text.append('Take the ' + current_route\
                                +' from '\
                                + current_stop['data']['stop_name']\
                                +' to '\
                                + resp[i]['data']['stop_name'] +'.'+\
                                str((resp[i]['time']-time)//60)+\
                                ' minutes')
                current_route = resp[i]['route']
                current_stop = resp[i]
                time = current_stop['time']
        resp = {'data':resp,'text':text}
                                                                
            




    #launch seperate thread to clean up the graph
    print('the count is',count)
    tear_down = Thread(target=tear_down_dijkstra,args=(destination_stops,))
    tear_down.start()
    return JsonResponse(resp,safe=False)


def tear_down_dijkstra(destination_stops):
     #remove foot links and back links added to the graph
    #this process should trigger a seperate thread so that we can return response quicker
    
    global network
    global graph_lock
    graph_lock = True
    for stop in destination_stops:
        del network.nodes[stop].foot_links['end']
    for node in network.nodes:
        network.nodes[node].back_links = []
    graph_lock = False

