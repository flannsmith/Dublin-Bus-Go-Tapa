from django.conf.urls import url
from . import views
from django.urls import path

urlpatterns = [
    url(r'^$', views.about, name='home_page'),
    url(r'^map.html',views.map_reader,name='mapreader'),
        url(r'^heatmap_html',views.heatmap,name='heatmap'),
        url(r'^get_routes/',views.get_routes,name='routes'),
        url(r'api/allstops',views.get_stops,name='stops'),
        path(r'api/dummy/<int:day>/<int:week>',views.dummy,name='dummy'),
        path(r'api/get-route-all-variation/<slug:routename>',views.get_route,name='getroute'),
        path(r'api/get-route-variation/<slug:routename>/<int:v>',views.get_route_variation, name='getroutevariation'),
        path(r'api/get-RTPI/<int:stop>', views.get_RTPI, name="get-rtpi"),
]
