FROM node:8.11.1-alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN apk --no-cache add bash

RUN npm i -g --verbose macaca-datahub --registry=https://registry.npm.taobao.org

COPY ./entrypoint.sh /entrypoint.sh

HEALTHCHECK --interval=10s --retries=6 \
  CMD wget -O /dev/null localhost:9200 || exit 1

ENTRYPOINT ["/entrypoint.sh"]
