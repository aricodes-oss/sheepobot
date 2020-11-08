FROM node:latest

RUN mkdir /code
WORKDIR /code

COPY . .

RUN rm .env

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
