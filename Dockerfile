FROM node:8.11.1-alpine

RUN apk --no-cache add python bash build-base ca-certificates

RUN npm config set unsafe-perm=true

COPY ./entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
