FROM node:20.10.0-alpine

WORKDIR /app
RUN npm install -g npm@10.2.5
COPY package.json ./
RUN npm install
COPY ./ ./

CMD [ "npm", "run", "dev" ]