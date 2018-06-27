FROM node:8.11.1-alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN apk --no-cache add bash

RUN npm config set unsafe-perm=true

RUN npm i -g --verbose macaca-datahub --registry=https://registry.npm.taobao.org

COPY ./entrypoint.sh /entrypoint.sh
COPY ./healthcheck.js /healthcheck.js

HEALTHCHECK CMD node /healthcheck.js || exit 1

ENTRYPOINT ["/entrypoint.sh"]
