from django.conf.urls import url
from . import views
from django.urls import path

urlpatterns = [
	url(r'^$', views.about, name='home_page'),
	url(r'^map.html',views.map_reader,name='mapreader'),
        url(r'^heatmap_html',views.heatmap,name='heatmap'),
        url(r'^get_routes/',views.get_routes,name='routes'),
]
