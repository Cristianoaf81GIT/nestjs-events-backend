FROM node:14.17.3-buster-slim

WORKDIR /home/nest-events

COPY package*.json ./

RUN npx yarn install

COPY . .

RUN npx yarn build

EXPOSE 3000

CMD ["npx", "yarn", "start:dev"]
