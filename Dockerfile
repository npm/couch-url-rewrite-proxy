# Set the base image to alpine Node LTS
FROM npmjs/npm-docker-baseline:6-alpine

# File Author / Maintainer
MAINTAINER Alex Robson

WORKDIR /app/src
COPY ./bin/ /app/src/bin/
COPY ./package.json /app/src/
COPY ./server.js /app/src/
COPY ./.kicker.toml /app/src/

RUN echo '@npm:registry=https://enterprise.npmjs.com/' >> ~/.npmrc && \
	cat ~/.npmrc && \
	npm install && \
	rm ~/.npmrc

RUN npm uninstall node-gyp -g && apk del python make g++ && rm -rf /var/cache/apk/*

EXPOSE 8080
