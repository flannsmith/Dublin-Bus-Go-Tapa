from django.test import TestCase
from django.test import Client
import requests
import time
import random
import datetime
import os
class api_tester(TestCase):
    def test_route_finder(self):
        
        max_lat = 53.5
        min_lat = 53.1
        max_lon = -6.4
        min_lon = -6.2
        for i in range(10):
            o_lat = random.uniform(min_lat,max_lat)
            o_lon = random.uniform(max_lon,min_lon)
            o_lon = o_lon * -1
            d_lat = random.uniform(min_lat,max_lat)
            d_lon = -1 * random.uniform(max_lon,min_lon)
            dt = datetime.datetime.now()
            day = float(dt.weekday())
            start_time = random.uniform(9.0,23.0)
            begin_time = time.time()
            #os.environ['NO_PROXY'] = '127.0.0.1'

            url='/api/routefinder/'
            url += str(o_lat) + '/' + str(o_lon) + '/' + str(d_lat) + '/' + str(d_lon) + '/' + str(day) + '/' + str(start_time)
            print(url)
            response = self.client.get(url)
            json = response.json
            self.assertEqual(isinstance(json,dict),True)
            self.assertEqual(json['error'],False)
            print(time.time() - begin_time)


def main():
    unittest.main()

if __name__ == "__main__":
    main()
