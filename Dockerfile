FROM node:latest

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY ./src .

EXPOSE 5000

CMD ["npx", "ts-node", "src/server.ts"]
