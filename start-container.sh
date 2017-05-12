#!/bin/bash

if [[ $1 == debug ]]; then
	docker run -it --rm --name npme-url-rewrite-proxy \
		-e FRONT_DOOR_HOST=172.16.123.1 \
		-e PORT=8080 \
		-e UPSTREAM=http://172.16.123.1:5984/upstream \
		-p 8080:8080 \
		npme-url-rewrite-proxy
		bash
else
	docker run -d --name npme-url-rewrite-proxy \
		-e FRONT_DOOR_HOST=172.16.123.1 \
		-e PORT=8080 \
		-e UPSTREAM=http://172.16.123.1:5984/upstream \
		-p 8080:8080 \
		npme-url-rewrite-proxy
fi