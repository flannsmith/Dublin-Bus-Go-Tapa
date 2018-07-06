from django.shortcuts import render
from django.http import HttpResponse
from django.db import models
from dublinBus.models import *
from django.http import JsonResponse
from dbanalysis.network import linear_network
from dbanalysis.stop_tools import stop_getter

network = linear_network.bus_network()
s_getter = stop_getter()
use_DJIKSTRA = False
if use_DJIKSTRA:
    import heapq
    for n in network.nodes:
        network.nodes[n].get_foot_links()
        network.nodes[n].all_links = set([i for i in network.nodes[n].get_links() if i in network.nodes] + [i for i in network.nodes[n].foot_links if i in network.nodes])

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
