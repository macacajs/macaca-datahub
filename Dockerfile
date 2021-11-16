FROM node:16-alpine

ENV RUN_MODE=docker

COPY . /root/datahub

WORKDIR /root/datahub

RUN npm i --production --verbose

HEALTHCHECK --interval=10s --retries=6 \
  CMD wget -O /dev/null localhost:9200 || exit 1

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 9200 9300

CMD ["npm", "start"]
