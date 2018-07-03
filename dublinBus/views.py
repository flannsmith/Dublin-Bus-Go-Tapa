from django.shortcuts import render
from django.http import HttpResponse
from django.db import models
from dublinBus.models import *
from django.http import JsonResponse
# from dbanalysis.network import linear_network
# network = linear_network.bus_network(load_from_pickle=True)
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
