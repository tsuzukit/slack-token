#!/bin/bash

CMDNAME=`basename $0`

# Move to project root
ROOT_DIR=`dirname $0`/../..
cd $ROOT_DIR

docker-compose -f docker-compose-prepare.yml build
docker-compose -f docker-compose-prepare.yml up -d

docker exec -it slack-token-prepare /bin/ash -c "cd contract && truffle test"

docker-compose -f docker-compose-prepare.yml down
