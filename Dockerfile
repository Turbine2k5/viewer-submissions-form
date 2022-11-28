ARG NODE_VERSION=16.13.1

FROM node:${NODE_VERSION}-alpine as build
WORKDIR /opt

COPY package.json yarn.lock tsconfig.json tsconfig.compile.json .barrelsby.json ./

RUN yarn install --pure-lockfile


COPY ./src ./src



FROM node:${NODE_VERSION}-alpine as runtime
ENV WORKDIR /opt
WORKDIR $WORKDIR

RUN apk update && apk add build-base git curl
RUN npm install -g pm2

COPY --from=build /opt .

RUN yarn install --pure-lockfile --production

COPY processes.config.js .

EXPOSE 8081
ENV PORT 8081
ENV NODE_ENV production

CMD ["pm2-runtime", "start", "processes.config.js", "--env", "production"]