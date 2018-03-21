#!/usr/bin/bash

CMDNAME=`basename $0`

# Move to project root
ROOT_DIR=`dirname $0`/../..
cd $ROOT_DIR

docker-compose -f docker-compose-ssl.yml down
docker-compose -f docker-compose-ssl.yml up -d

