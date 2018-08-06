from django.conf.urls import url
from . import views
from django.urls import path

app_name='dublinBus'
urlpatterns = [
    url(r'^$', views.login_view, name='login'),
    url(r'^signup', views.signup_view, name='signup'),
    url(r'^logout', views.logout_view, name='logout'),
    url(r'^change_password', views.change_password_view, name='change_password'),
    url(r'^home_page$', views.about, name='home_page'),
    url(r'^JourneyPlanner$', views.journeyPlanner, name='blog'),
    url(r'^map.html',views.map_reader,name='mapreader'),
    path(r'favourites/<slug:loc_address>/<slug:loc_name>', views.user_favourites, name='favourites'),
    url(r'api/userLocation/(?P<origin_Lat>\d+\.\d+)/(?P<origin_Lon>\d+\.\d+)$', views.user_location, name='user_location'),
    #path(r'example_view',views.example_view,name='example_view'),
        url(r'^heatmap_html',views.heatmap,name='heatmap'),
        url(r'^get_routes/',views.get_routes,name='routes'),
        url(r'api/allstops',views.get_stops,name='stops'),
        #route selection api things
        path(r'api/routeselection/allroutes',views.get_all_routes,name='get-all-routes'),
        path(r'api/routeselection/routevariations/<slug:route>',views.get_variations,name='get-route-variations'),
        path(r'api/routeselection/routestops/<slug:route>/<int:variation>',views.get_stops_in_route,name='get-route-stops'),
        path(r'api/routeselection/route_shape/<slug:route>/<int:variation>/<int:stopA>/<int:stopB>',views.get_route_shape,name='get-route-stops'),
        path(r'api/routeselection/routes_from_stop/<slug:stop>',views.routes_serving_stop,name='routes-serving-stop'),
        #misc
        path(r'api/dummy/<int:day>/<int:week>',views.dummy,name='dummy'),
        path(r'api/get-route-all-variation/<slug:routename>',views.get_route,name='getroute'),
        path(r'api/get-route-variation/<slug:routename>/<int:v>',views.get_route_variation, name='getroutevariation'),
        path(r'api/get-RTPI/<int:stop>', views.get_RTPI, name="get-rtpi"),
        path(r'api/timetables/<int:stop>',views.get_timetable,name='get-timetable'),
        path(r'api/shapes/twostops/<int:stop>/<int:link>',views.get_shape,name='get-shape'),
        path(r'api/shapes/route/<slug:routename>/<int:vari>',views.get_route_shape, name='route-shape'),
        #route finder
        path(r'api/testroutefinder',views.test_dijkstra,name='tester'),
        url(r'api/routefinder/(?P<origin_Lat>\d+\.\d+)/(?P<origin_Lon>\d+\.\d+)/(?P<destination_Lat>\d+\.\d+)/(?P<destination_Lon>\d+\.\d+)/(?P<starttime>\d+\.\d+)$',views.dijkstra2,name='djikstra-djikstra'),
        #user
        path(r'api/clientip',views.get_ip,name='get_ip'), 
        url(r'api/buspoints/(?P<lat>\d+\.\d+)/(?P<lon>\d+\.\d+)$',views.request_dublin_bus_points,name='points_requester'),
url(r'api/stopfinder/(?P<lat>\d+\.\d+)/(?P<lon>\d+\.\d+)$',views.closest_stops,name='closest_stops'),     
]     

