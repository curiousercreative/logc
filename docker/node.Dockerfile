FROM node:lts

WORKDIR /usr/src/logc
ADD . /usr/src/logc

RUN npm install
RUN npm install pm2 -g
