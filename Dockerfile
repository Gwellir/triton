FROM node:lts-alpine

MAINTAINER Flammenmensch<maleventum@gmail.com>

ARG APPLICATION

RUN npm install -g nodemon

ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /app/$APPLICATION && cp -a /tmp/node_modules /app/$APPLICATION/

WORKDIR /app/$APPLICATION
COPY dist/apps/$APPLICATION/ /app/$APPLICATION

EXPOSE 3000

CMD [ "nodemon", "main.js" ]
