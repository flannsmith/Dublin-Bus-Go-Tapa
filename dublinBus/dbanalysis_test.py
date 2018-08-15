from dbanalysis.network import simple_network3
import pickle
n = simple_network3.simple_network(build=False)
with open('static/neuraltimetabledump.bin','rb') as handle:
    n.nodes = pickle.load(handle)

n.prepare_dijkstra()
arr = n.routes['39A'][0][1:]
current_time = 36000 
for i in range(len(arr)):

    print(n.nodes[str(arr[i])].stop_id)
    a=n.get_next_stop(str(arr[i]),str(arr[i+1]),6,current_time)[0]
    current_time = a[1]
    print(current_time,a[2])
    input()
