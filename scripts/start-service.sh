#!/bin/bash

node ./bin/couch-url-rewrite-proxy.js start \
	--port=8080 \
	--front-door-host=$FRONT_DOOR_HOST \
	--upstream=$UPSTREAM
