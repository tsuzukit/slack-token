#!/bin/bash

CMDNAME=`basename $0`

# Move to project root
ROOT_DIR=`dirname $0`/..
cd $ROOT_DIR

docker exec -it slack-token-app /bin/ash -c "cd contract && truffle compile"
