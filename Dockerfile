FROM node:latest

RUN mkdir /code
WORKDIR /code

COPY . .

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
