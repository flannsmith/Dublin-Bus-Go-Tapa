import os
directory = "/Users/gavin/Desktop/gavinResearchP/Dublin-Bus-Repo/dublinBus/static/bundles/local"
files = os.listdir('/Users/gavin/Desktop/gavinResearchP/Dublin-Bus-Repo/dublinBus/static/bundles/local')
from subprocess import call
for filename in files:
    if filename != 'vendors.js':
        call(['rm',directory+'/'+filename])
