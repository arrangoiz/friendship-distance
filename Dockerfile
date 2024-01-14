FROM node:slim

RUN npm install -g npm@10.3.0

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm i

CMD npm run dev