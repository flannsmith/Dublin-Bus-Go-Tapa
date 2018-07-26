class ultimate_model ():

    def __init__(self):
        """
        Ultimate model that just predicts the average for the given time of the given day, from now until
        the end of time.

        Predicts for all routes, unless we have like 0 data on them, in which case... well. Alas...
        """
        import pickle
        import json
        self.routes = json.loads(open('/home/student/dbanalysis/dbanalysis/resources/trimmed_routes.json').read())
        with open('/data/times.pickle','rb') as handle:
            self.times = pickle.load(handle)
        from dbanalysis.stop_tools import stop_getter
        self.s_getter = stop_getter()
        self.stops_dict = json.loads(open('/home/student/dbanalysis/dbanalysis/resources/stops_trimmed.json').read())
        
    def get_available_routes(self):
        return [route for route in self.routes]
        
    def get_route_description(self,route):
        resp = {}
        for v in route:
               
            stopA = route[v][1]
            stopB = route[v][-1]
            resp[v] = {'from': self.stops_dict[str(stopA)],\
                'to' : self.stops_dict[str(stopB)]}
        return resp
    def get_route_variation_stops(self,route,variation):
            
        resp = []
        for stop in self.routes[route][variation]:
            a = self.stops_dict[str(stop)]
            a['stop_id'] = stop
            resp.append(a)
        return resp

    def predict(self,route,variation,stopA,stopB,hour,day):
        
        arr = self.routes[route][variation][1:]
        start_index = arr.index(int(stopA))
        end_index = arr.index(int(stopB))
        total_time = 0
        prev_time = 0
        for i in range(start_index, end_index):
            stopA = arr[i]
            stopB = arr[i+1]
            try:
                total_time += self.times[str(stopA)][str(stopB)][day][hour]
            except:
                if str(stopA) in self.times and str(stopB) in self.times[str(stopA)]:
                    try:
                        total_time+=self.handle_missing_time(self.times[str(stopA)][str(stopB)],day,hour)
                    except:
                        print(day,hour,route,variation,stopA,stopB)
                        input()
                        total_time += self.handle_missing_link(arr,stopA,stopB,hour,day)
                else:
                
                    total_time += self.handle_missing_link(arr,stopA,stopB,hour,day)

        return total_time
    def handle_missing_time(self,data,hour,day):
        if day not in data:
            return 'error'
        total = 0
        count = 0
        for hour in data[day]:
            count+=1
            total + data[day][hour]
        return total / count
        
        
    def handle_missing_link(self,arr,stopA,stopB,hour,day):
            
        #for now, just sample two closest stops and sample the distance
        index1 = arr.index(stopA)
        index2 = arr.index(stopB)
        distance = self.s_getter.get_stop_distance(str(stopA),str(stopB))
        
        if distance == None:
            input()
       
        a=False
        
        for i in range(index1,-1,-1):
            d = self.s_getter.get_stop_distance(str(arr[i]),str(arr[i+1]))
            if d != None:
                try:
                    a_model = self.times[str(arr[i])][str(arr[i+1])][day][hour]
                    b_distance = d
                    b = True
                    break
                except:
                    continue

         
        
        b=False
        for i in range(index2,len(arr)-1):
      
            d = self.s_getter.get_stop_distance(str(arr[i]),str(arr[i+1]))
            if d != None:
                try:
                    b_model = self.times[str(arr[i])][str(arr[i+1])][day][hour]
                    b_distance = d
                    b = True
                    break
                except:
                    continue

        if a and b:
            a_speed = a_distance/a_model
            b_speed = b_distance/b_model
            speed = (a_speed + b_speed) / 2
            return distance / speed

        elif b and not a:
            return distance / (b_distance/b_model)
        elif a and not b:
            return distance / (a_distance/a_model)
        else:
            return 'err'
                
if __name__ == '__main__':
    um = ultimate_model()
    routes = um.routes
   
    print(um.routes['15'][1])
    print(um.predict('15',1,'6318','6282',11,4))
    # purely random tests
    count = 0
    while count < 100:
        count+=1
        import random
        route = random.choice([i for i in um.routes])
        if len(um.routes[route])==0:
            continue
        variation = random.choice([i for i in range(len(um.routes[route]))])
        r = um.routes[route][variation]
        stopA = r[1]
        stopB = r[-1]
        print(um.predict(route,variation,stopA,stopB,random.randint(10,12),random.randint(0,4)))


         

            
            

