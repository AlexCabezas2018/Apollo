FROM node:alpine

WORKDIR /apollo-server

COPY . /apollo-server

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start"]

