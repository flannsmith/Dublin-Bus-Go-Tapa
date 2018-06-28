import os
directory = '/home/student/ResearchPracticum/django/dublinBus/static/bundles/local'
files = os.listdir('/home/student/ResearchPracticum/django/dublinBus/static/bundles/local')
from subprocess import call
for filename in files:
    if filename != 'vendors.js':
        call(['rm',directory+'/'+filename])
