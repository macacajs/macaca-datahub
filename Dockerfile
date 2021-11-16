FROM node:lts-alpine

RUN apk --no-cache add bash python3

ENV RUN_MODE=docker

COPY . /root/datahub

WORKDIR /root/datahub

RUN npm i --production --verbose

HEALTHCHECK --interval=10s --retries=6 \
  CMD wget -O /dev/null localhost:9200 || exit 1

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 9200 9300

ENV ENABLE_JAVASCRIPT=Y \
    ENABLE_REQUEST_PROXY=Y

CMD ["npm", "start"]
