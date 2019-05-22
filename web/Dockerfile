FROM node:11.15.0-alpine

WORKDIR /usr/src/app

ARG npm_key
COPY package.json package-lock.json ./
RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/ && npm config set "//npm.fontawesome.com/:_authToken" $npm_key
RUN npm install

COPY . .
RUN npm run build

EXPOSE 9001
CMD ["npm", "start"]