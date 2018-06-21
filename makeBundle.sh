#!/bin/bash

python deleteold.py

node_modules/.bin/webpack --config webpack.local.config.js

python fixfilename.py
