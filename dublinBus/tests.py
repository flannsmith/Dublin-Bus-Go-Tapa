from django.test import TestCase
from .models import Userlocation, Userpoints
from django.urls import reverse
from django.test import Client
client=Client()

# Create your tests here.
'''

Example test case from the docs

class AnimalTestCase(TestCase):
    def setUp(self):
        Animal.objects.create(name="lion", sound="roar")
        Animal.objects.create(name="cat", sound="meow")

    def test_animals_can_speak(self):
     
        lion = Animal.objects.get(name="lion")
        cat = Animal.objects.get(name="cat")
        self.assertEqual(lion.speak(), 'The lion says "roar"')
        self.assertEqual(cat.speak(), 'The cat says "meow"')
'''

class testStops(TestCase):

    def setUp(self):
        pass


    def test_all_stops(self):
        pass

    #def test_weather(self):
    #    self.assertIs(weather_record.temp,20.4)     
    
    def test_api_responses(self):
        login_response = client.get(reverse('dublinBus:login')) 
        self.assertIs(login_response.status_code,200)           

if __name__ == '__main__':
    test = testStops()
    test.test_all_stops()
