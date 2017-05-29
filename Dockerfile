FROM node:latest

RUN mkdir -p /opt/src/app
WORKDIR /opt/src/app

COPY package.json /opt/src/app/
RUN npm install

COPY . /opt/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
