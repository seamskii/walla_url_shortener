FROM node:18 AS builder

WORKDIR /usr/src/app

COPY web/package*.json ./

RUN npm install

COPY web/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
