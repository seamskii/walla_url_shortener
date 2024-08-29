FROM node:20

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install

COPY server/ .

RUN npm run build

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
