from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
'''
This is just a example model from the tutorial to use as a refrence to begin with - Gav

class Post(models.Model):
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(
            default=timezone.now)
    published_date = models.DateTimeField(
            blank=True, null=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title
'''

#Model for Stops
class Stops(models.Model):
    stop_id = models.CharField(max_length=20)
    stop_name = models.CharField(max_length=100)
    stop_lat = models.DecimalField(max_digits=20, decimal_places=18)
    stop_lon = models.DecimalField(max_digits=20, decimal_places=18)

    #Add fucntions to manipulate data SQL queries etc. 

    def __str__(self):
        return self.stop_id

#Model for routes
class Routes(models.Model):
    route_id=models.CharField(max_length=15, primary_key=True)
    route_shortname=models.CharField(max_length=4)
    route_type=models.IntegerField()

    def __str__(self):
        return self.route_id

#Model for shapes
class Shapes(models.Model):
    shape_id=models.CharField(max_length=20)
    shape_pt_lat=models.DecimalField(max_digits=20, decimal_places=18)
    shape_pt_lon=models.DecimalField(max_digits=20, decimal_places=18)
    shape_pt_sequence=models.CharField(max_length=5)
    shape_dist_travelled=models.DecimalField(max_digits=25, decimal_places=18)

    class Meta:
        unique_together = (('shape_id', 'shape_pt_sequence'),)
        
        
#Model for event calander
class Event(models.Model):
    day=models.DateField(u'Day of travel', help_text=u'Day of travel')
    start_time=models.TimeField(u'Starting time', help_text=u'Starting time')

    class Meta:
        verbose_name=u'Scheduling'
        verbose_name_plural=u'Scheduling'

#Model for TimeTables
class Stops(models.Model):
    stop_id = models.CharField(max_length=20)
    stop_name = models.CharField(max_length=100)
    stop_lat = models.DecimalField(max_digits=20, decimal_places=18)
    stop_lon = models.DecimalField(max_digits=20, decimal_places=18)

    #Add fucntions to manipulate data SQL queries etc. 

    def __str__(self):
        return self.stop_id

#Model for user favourites option
class UserFavourites(models.Model):
    user_id=models.ForeignKey(User, related_name="+", on_delete=models.CASCADE)
    location_address=models.CharField(max_length=100)
    location_name=models.CharField(max_length=20)
    
class Userpoints(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    dublin_bus_points = models.IntegerField()

class Userlocation(models.Model):
    user_id=models.ForeignKey(User, on_delete=models.CASCADE)
    user_lat=models.DecimalField(max_digits=20, decimal_places=18)
    user_lon=models.DecimalField(max_digits=20, decimal_places=18)
    insert_timestamp=models.DateTimeField()    

    class Meta:
        unique_together = (('user_id', 'insert_timestamp'),)

class Weatherdetails(models.Model):
    weather_date = models.CharField(max_length=20)
    rain = models.DecimalField(max_digits=7, decimal_places=4)
    temp = models.DecimalField(max_digits=7, decimal_places=2)
    wetb = models.DecimalField(max_digits=7, decimal_places=2)
    dewpt = models.DecimalField(max_digits=7, decimal_places=2)
    vappr = models.DecimalField(max_digits=7, decimal_places=2)
    rhum = models.IntegerField()
    msl = models.DecimalField(max_digits=7, decimal_places=2)

class WeatherForecast(models.Model):
    date = models.CharField(max_length=20)
    rain = models.DecimalField(max_digits=10, decimal_places=3)
    temp = models.DecimalField(max_digits=10, decimal_places=3)
    wetb = models.DecimalField(max_digits=10, decimal_places=3)
    dewpt = models.DecimalField(max_digits=10, decimal_places=3)
    vappr = models.DecimalField(max_digits=10, decimal_places=3)
    rhum = models.IntegerField()
    msl = models.DecimalField(max_digits=10, decimal_places=3)

