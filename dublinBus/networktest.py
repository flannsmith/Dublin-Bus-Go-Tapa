import unittest
from dbanalysis.network import simple_network3
class test_network(unittest.TestCase):
    def test_load(self):
        import pickle
        self.n= simple_network3.simple_network(build=False)
        with open('static/neuraltimetabledump.bin','rb') as handle:
            self.n.nodes = pickle.load(handle)
        self.assertEqual(isinstance(self.n.nodes,dict),True)
    

        routes = self.n.routes
        for r in routes:
            for index,v in enumerate(routes[r]):
                for i in range(1,len(v)-1):
                    a = str(v[i])
                    b=str(v[i+1]) 
                    self.assertEqual(a in self.n.nodes, True)
                    self.assertEqual(b in self.n.nodes[a].links,True)
            
def main():
    unittest.main()

if __name__ == "__main__":
    main()
