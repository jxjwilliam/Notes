#!/bin/bash

./end.sh

cd /overpass/application/chaim.overpass.com
#source params.rc
#gulp parse-config && gulp build
gulp build

cd /overpass/application/gps.overpass.com
#gulp parse-config && gulp build
gulp build
: > nohup.out

# nohup crossbar start &
crossbar start > nohup.out 2>&1 &

