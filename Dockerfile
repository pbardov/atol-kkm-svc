# stage 1: builder
FROM node:20 AS builder
WORKDIR /usr/src/app

# установить git и ssh-клиент
RUN apt-get update && apt-get install -y git openssh-client curl wget build-essential

# скопировать папку fptr10 с deb-пакетами
COPY ./fptr10 ./fptr10

# установить libfptr10 из каталога fptr10 с разрешением зависимостей
RUN find ./fptr10 -name "libfptr10*.deb" -exec dpkg -i {} \; || true && \
    apt-get install -f -y

# скопировать package.json, установить зависимости
COPY package.json yarn.lock ./
RUN --mount=type=secret,id=npmrc,target=/usr/src/app/.npmrc \
    yarn install

COPY tsconfig.json tsconfig.build.json ./
COPY src/ ./src

# собрать проект
RUN yarn build

# stage 2: runtime
FROM node:20 AS runtime
WORKDIR /usr/src/app

# установка необходимых зависимостей
RUN apt-get update && apt-get install -y build-essential

# скопировать папку fptr10 с deb-пакетами
COPY ./fptr10 ./fptr10

# установить libfptr10 из каталога fptr10 с разрешением зависимостей
RUN find ./fptr10 -name "libfptr10*.deb" -exec dpkg -i {} \; || true && \
    apt-get install -f -y

ARG MODE=production
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:./node_modules/.bin:/home/node/.npm-global/bin

# Установить NODE_ENV для установки зависимостей
ENV NODE_ENV=${MODE}

# установить зависимости
COPY package.json yarn.lock ./
RUN --mount=type=secret,id=npmrc,target=/usr/src/app/.npmrc \
    yarn install

RUN apt-get clean

# копировать dist из builder stage в текущий этап
COPY --from=builder /usr/src/app/dist ./
RUN chown -R node:node /usr/src/app

EXPOSE 8080
CMD node main.js

USER node
