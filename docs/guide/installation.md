# Installation

## Requirements

To install macaca-datahub, [Node.js](https://nodejs.org) environment is required.

## Installation

Macaca datahub is distibuted through npm. To install it, run the following command line:

```bash
$ npm i macaca-datahub -g
```

## Common Usage

Start datahub server

```bash
$ datahub server
```

The server will create backup files with prefix 'macaca-datahub.data-backup-' for the database periodically.

## Run with docker

```bash
$ docker run -it -p 9200:9200 -p 9300:9300 macacajs/macaca-datahub
```

## Play Docker

Run as standalone just once service.

```bash
$ docker run -it --rm \
  --name macaca-datahub \
  -p 9200:9200 \
  -p 9300:9300 \
  macacajs/macaca-datahub
```

Run with existed DataHub's database in your host.

```bash
$ docker run -it --rm \
  --name macaca-datahub \
  -v $HOME/.macaca-datahub:/root/.macaca-datahub \
  -p 9200:9200 \
  -p 9300:9300 \
  macacajs/macaca-datahub
```

Run as a service.

```bash
$ docker run \
  --name macaca-datahub \
  -v $HOME/.macaca-datahub:/root/.macaca-datahub \
  -p 9200:9200 \
  -p 9300:9300 \
  -d macacajs/macaca-datahub
```

Build base image.

```bash
$ docker build --no-cache --pull -t="macacajs/macaca-datahub" .
```
