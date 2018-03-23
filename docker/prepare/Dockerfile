FROM node:9.8.0-alpine

RUN apk update && apk add git python make g++

WORKDIR /var/app/
RUN npm install -g truffle

ENTRYPOINT tail -f /dev/null

