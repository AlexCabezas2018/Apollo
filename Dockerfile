FROM node:alpine

WORKDIR /apollo-server

COPY . /apollo-server

RUN npm install

CMD ["npm", "run", "start"]

