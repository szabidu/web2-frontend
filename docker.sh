#!/bin/bash
set -e
docker build -t tilosradio/frontend .
docker tag -f tilosradio/frontend tilos:5555/tilosradio/frontend
sudo docker push tilos.hu:5555/tilosradio/frontend

