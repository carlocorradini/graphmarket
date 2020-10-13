FROM node:alpine

RUN apk update
RUN apk add git

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm ci

COPY . /usr/src/app
RUN npm run build

EXPOSE 8080
CMD [ "npm", "start" ]