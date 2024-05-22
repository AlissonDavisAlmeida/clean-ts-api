FROM node:18.19.0-alpine
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./.env .
RUN npm install --only=production
EXPOSE 3000
