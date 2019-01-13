# Install

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

