FROM node:8-alpine

RUN sed -i 's/http:\/\/dl-cdn.alpinelinux.org/https:\/\/mirrors.aliyun.com/g' /etc/apk/repositories

RUN apk --no-cache add bash python

ENV RUN_MODE=docker

COPY . /root/datahub

WORKDIR /root/datahub

RUN npm install --production --verbose && ln -s /root/logs .

HEALTHCHECK --interval=10s --retries=6 \
  CMD wget -O /dev/null localhost:9200 || exit 1

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 9200 9300
CMD ["npm", "start"]
