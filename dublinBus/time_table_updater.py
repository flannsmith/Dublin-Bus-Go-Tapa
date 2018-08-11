import pickle
import datetime
import time
from subprocess import call
import os
if __name__ == '__main__':
    while True:
        now = datetime.datetime.now()
        seconds_since_midnight = (now - now.replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds()
        
        if not os.path.exists('static/timetabledump.bin'):
            can_build = True
        
        elif seconds_since_midnight < 7200:
            time.sleep(7200 - seconds_since_midnight)
            can_build = True
        elif seconds_since_midnight > 7200:
            time.sleep( (3600*24) - seconds_since_midnight + 7200)
            can_build = True
        else:
            can_build = True

        if can_build:
            call(['touch','static/build_lock'])
            print('building')
            from dbanalysis.network import simple_network2
            n = simple_network2.simple_network()
            n.generate_time_tables()
            for node in n.nodes:
                n.nodes[node].timetable.concat_and_sort()
            for node in n.nodes:
                try:
                    pass
                except:
                    pass
            with open('static/timetabledump.bin','wb') as handle:
                pickle.dump(n.nodes,handle,protocol=pickle.HIGHEST_PROTOCOL)
       
            del(n)
            del(simple_network)
            call(['rm','static/build_lock'])
            print('built')
