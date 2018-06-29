import os
from subprocess import call
directory ='/Users/gavin/Desktop/gavinResearchP/Dublin-Bus-Repo/dublinBus/static/bundles/local'
for filename in os.listdir('/Users/gavin/Desktop/gavinResearchP/Dublin-Bus-Repo/dublinBus/static/bundles/local'):

    if filename[0:4] == 'App1':
        call(['mv',directory+'/'+ filename, directory+'/'+'App1.js'])
