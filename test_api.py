import unittest
import requests
import time
import random
import datetime

class api_tester(unittest.TestCase):

    def test_routeData_apis(self):
        import requests
        # Test Api to return all routes
        response = requests.get('https://csi420-01-vm8.ucd.ie/api/routeselection/allroutes')
        json = response.json()
        self.assertEqual(isinstance(json,dict),True)
        self.assertEqual('routes' in json,True)
        routes = json['routes']
        unavailableRoutes = []
        timeTablesWithNoData = 0
        print("Starting call")
        for route in routes:
            # Test Api to return route variations
            response = requests.get('https://csi420-01-vm8.ucd.ie/api/routeselection/routevariations/'+route)
            json = response.json()
            self.assertEqual(isinstance(json,dict),True)
            self.assertEqual(json['error'] == False,True)
            self.assertEqual(len(json['data']) > 0,True)
            for i in range(len(json['data'])):
                # Test Api to return stops in route variation
                response2 = requests.get('https://csi420-01-vm8.ucd.ie/api/routeselection/routestops/'+route+'/'+str(i))
                json2 = response2.json()
                if not isinstance(json2,list):
                    unavailableRoutes.append(str(route)+' '+str(i))
                else:
                    self.assertEqual(len(json2) > 0,True)
                if isinstance(json2,list):
                    for j in range(len(json2)):
                        # Test Api to return timetable for a stop
                        response3 = requests.get('https://csi420-01-vm8.ucd.ie/api/timetables/'+str(json2[j]['id']))
                        json3 = response3.json()
                        if json3['error']:
                            timeTablesWithNoData += 1
                        else:
                            self.assertEqual(isinstance(json3,dict),True)
                            self.assertEqual(len(json3['timetable']) > 0,True)

                        end = len(json2) -1
                        if j == end:
                            continue
                        # Test Api to return route shape from stop x to z
                        shapesResponse = requests.get('https://csi420-01-vm8.ucd.ie/api/routeselection/route_shape/'+route+'/'+str(i)+'/'+str(json2[j]['id'])+'/'+str(json2[end]['id']))
                        shapesResponsejson = shapesResponse.json()
                        self.assertEqual(isinstance(shapesResponsejson,dict),True)

                        # Test Api to to return travel time prediction
                        predictorResponse = requests.get('https://csi420-01-vm8.ucd.ie/api/predictor/1'+route+'/'+str(i)+'/'+str(json2[j]['id'])+'/'+str(json2[end]['id'])+'/32400')
                        shapesResponsejson = shapesResponse.json()
                        self.assertEqual(isinstance(shapesResponsejson,dict),True)

        print("Unavailable Routes:", unavailableRoutes)
        print("Timetables with no data: ", timeTablesWithNoData)

    def test_stop_finder(self):
        import random
        max_lat = 53.5
        min_lat = 53.1
        max_long = -6.4
        min_long = -6.2
        errors = 0
        number_calls = 20
        for i in range(number_calls):
            o_lat = random.uniform(min_lat,max_lat)
            o_lon = random.uniform(max_long,min_long) * -1
            url = "https://csi420-01-vm8.ucd.ie/api/stopfinder/"+str(o_lat) + '/' + str(o_lon)
            response = requests.get(url)
            json = response.json()
            self.assertEqual(isinstance(json,dict),True)
            self.assertEqual('stops' in json,True)
            self.assertEqual(len(json['stops']) > 0,True)

    def test_userLocation(self):
        import random
        max_lat = 53.5
        min_lat = 53.1
        max_long = -6.4
        min_long = -6.2
        number_calls = 20
        for i in range(number_calls):
            o_lat = random.uniform(min_lat,max_lat)
            o_lon = random.uniform(max_long,min_long) * -1
            response = requests.get('https://csi420-01-vm8.ucd.ie/api/userLocation/'+str(o_lat)+'/'+str(o_lon))
            self.assertEqual(response.status_code == 200 or response.status_code == 204,True)

    # Need to login first before test??!
    # def test_userDetails(self):
    #     response = requests.get('https://csi420-01-vm8.ucd.ie/api/get-user-profile')
    #     json = response.json()
    #     self.assertEqual(isinstance(json,dict),True)
    #     self.assertEqual('username' in json,True)
    #     self.assertEqual('points' in json,True)
    #     self.assertEqual('leaderboard' in json,True)
    #     self.assertEqual('user_message' in json,True)

    def test_route_finder(self):
        import random
        max_lat = 53.5
        min_lat = 53.1
        max_long = -6.4
        min_long = -6.2
        errors = 0
        number_calls = 20
        for i in range(number_calls):
            o_lat = random.uniform(min_lat,max_lat)
            o_lon = random.uniform(max_long,min_long)
            o_lon = o_lon * -1
            d_lat = random.uniform(min_lat,max_lat)
            d_lon = -1 * random.uniform(max_long,min_long)
            dt = datetime.datetime.now()
            day = float(dt.weekday())
            time = float(random.uniform(9.0,23.0) * 3600)
            url='https://csi420-01-vm8.ucd.ie/api/routefinder/'+str(o_lat) + '/' + str(o_lon) + '/' + str(d_lat) + '/' + str(d_lon) + '/' + str(day) + '/' + str(time)
            response = requests.get(url)
            json = response.json()
            self.assertEqual(isinstance(json,dict),True)
            # self.assertEqual('error' in json,True)
            # if json['error'] == False:
            #     errors += 1
            #     continue
            # self.assertEqual(isinstance(json['data'],list),True)
            # self.assertEqual(isinstance(json['shapes'],dict),True)
            # self.assertEqual(isinstance(json['text'],dict),True)
            # for shape_part in json['shapes']['walk']:
            #     self.assertEqual(isinstance(shape_part,list),True)

def main():
    unittest.main()

if __name__ == "__main__":
    main()

