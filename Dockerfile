FROM node:8

COPY . /src

WORKDIR src

ENTRYPOINT ["/src/entrypoint.sh"]
