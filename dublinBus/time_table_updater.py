import pickle
import datetime
import time
from subprocess import call
import os
"""
Script to run in background generating time tables once a day
"""
if __name__ == '__main__':
    just_started = True
    while True:
        now = datetime.datetime.now()
        seconds_since_midnight = (now - now.replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds()
        
        if not os.path.exists('static/timetabledump.bin') or just_started:
            can_build = True
            just_started = False
        elif seconds_since_midnight < 7200:
            time.sleep(7200 - seconds_since_midnight)
            can_build = True
        elif seconds_since_midnight > 7200:
            time.sleep( (3600*24) - seconds_since_midnight + 2000)
            can_build = True
        else:
            can_build = True

        if can_build:
            
            print('building')
            from dbanalysis.network import simple_network4
            n = simple_network4.simple_network()
            n.prepare_dijkstra()
            n.properly_add_foot_links()
            n.generate_time_tables()
            for node in n.nodes:
                n.nodes[node].timetable.concat_and_sort()
            for node in n.nodes:
                try:
                    del(n.nodes[node].models)
                    del(n.nodes[node].Y_scalers)
                    del(n.nodes[node].X_scalers)
                    pass
                except:
                    pass
            with open('static/timetabledump.bin','wb') as handle:
                pickle.dump(n.nodes,handle,protocol=pickle.HIGHEST_PROTOCOL)
            dt = datetime.datetime.now()
            f = open('static/timetablelog.log','a')
            f.write('Time tables dumped at ' + str(dt))
            f.close()  
            del(n)
            del(simple_network)
            call(['rm','static/.build_lock'])
            print('built')
