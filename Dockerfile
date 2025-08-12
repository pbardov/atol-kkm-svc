# stage 1: builder
FROM node:20 AS builder
WORKDIR /usr/src/app

# установить git и ssh-клиент
RUN apt-get update && apt-get install -y git openssh-client curl wget build-essential

# скопировать папку fptr10 с deb-пакетами
COPY ./fptr10 ./fptr10

# установить libfptr10 из каталога fptr10 с разрешением зависимостей
RUN find ./fptr10 -name "libfptr10*.deb" -exec dpkg -i {} \; || true && \
    apt-get update && apt-get install -f -y

# скопировать package.json, установить зависимости
COPY package.json yarn.lock ./
RUN yarn install

# скопировать весь контекст, включая .git
COPY . .

# добавить репозиторий в known_hosts, чтобы не было вопросов о подтверждении ключа
RUN mkdir -p /root/.ssh && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts

# инициировать сабмодули, передав SSH-ключи через --mount=type=ssh
RUN --mount=type=ssh git submodule update --init --recursive

# собрать проект
RUN yarn build

# stage 2: runtime
FROM node:20 AS runtime

# установка необходимых зависимостей
RUN apt-get update && apt-get install -y build-essential

# скопировать папку fptr10 с deb-пакетами
COPY ./fptr10 ./fptr10

# установить libfptr10 из каталога fptr10 с разрешением зависимостей
RUN find ./fptr10 -name "libfptr10*.deb" -exec dpkg -i {} \; || true && \
    apt-get update && apt-get install -f -y

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY --from=builder /usr/src/app/dist .

EXPOSE 8080
CMD [ "node", "main.js" ]

USER node
