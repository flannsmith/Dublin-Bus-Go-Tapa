from django.shortcuts import render
from django.http import HttpResponse
from django.db import models
from dublinBus.models import *
from django.http import JsonResponse
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
