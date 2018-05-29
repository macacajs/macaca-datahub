FROM node:8.11.1-alpine

RUN apk --no-cache add python bash build-base ca-certificates

RUN npm config set unsafe-perm=true

RUN npm i -g macaca-datahub

COPY ./entrypoint.sh /entrypoint.sh
COPY ./healthcheck.js /healthcheck.js

HEALTHCHECK CMD node /healthcheck.js || exit 1

ENTRYPOINT ["/entrypoint.sh"]
