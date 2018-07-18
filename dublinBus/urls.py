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
        url(r'^heatmap_html',views.heatmap,name='heatmap'),
        url(r'^get_routes/',views.get_routes,name='routes'),
        url(r'api/allstops',views.get_stops,name='stops'),
        path(r'api/dummy/<int:day>/<int:week>',views.dummy,name='dummy'),
        path(r'api/get-route-all-variation/<slug:routename>',views.get_route,name='getroute'),
        path(r'api/get-route-variation/<slug:routename>/<int:v>',views.get_route_variation, name='getroutevariation'),
        path(r'api/get-RTPI/<int:stop>', views.get_RTPI, name="get-rtpi"),
        path(r'api/timetables/<int:stop>',views.get_timetable,name='get-timetable'),
        path(r'api/shapes/twostops/<int:stop>/<int:link>',views.get_shape,name='get-shape'),
        path(r'api/shapes/route/<slug:routename>/<int:vari>',views.get_route_shape, name='route-shape'),
        path(r'api/testroutefinder',views.test_dijkstra,name='tester'),
        url(r'api/routefinder/(?P<origin_Lat>\d+\.\d+)/(?P<origin_Lon>\d+\.\d+)/(?P<destination_Lat>\d+\.\d+)/(?P<destination_Lon>\d+\.\d+)/(?P<starttime>\d+\.\d+)$',views.dijkstra2,name='djikstra-djikstra'),      
]
