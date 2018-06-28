from django.test import TestCase
from dublinBus.models import stops
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


    def test_correct_stops(self):
        
        pass
        



