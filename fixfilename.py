import os
from subprocess import call
directory ='/home/student/ResearchPracticum/django/dublinBus/static/bundles/local'
for filename in os.listdir('/home/student/ResearchPracticum/django/dublinBus/static/bundles/local'):

    if filename[0:4] == 'App1':
        call(['mv',directory+'/'+ filename, directory+'/'+'App1.js'])
