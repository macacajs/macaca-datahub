# macaca-datahub

---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/macaca-datahub.svg?style=flat-square
[npm-url]: https://npmjs.org/package/macaca-datahub
[travis-image]: https://img.shields.io/travis/macacajs/macaca-datahub.svg?style=flat-square
[travis-url]: https://travis-ci.org/macacajs/macaca-datahub
[coveralls-image]: https://img.shields.io/codecov/c/github/macacajs/macaca-datahub.svg?style=flat-square
[coveralls-url]: https://codecov.io/gh/macacajs/macaca-datahub
[node-image]: https://img.shields.io/badge/node.js-%3E=_7-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/macaca-datahub.svg?style=flat-square
[download-url]: https://npmjs.org/package/macaca-datahub

> Continuous data provider for development, testing, staging and production.

## Introduction

[macacajs.github.io/datahub](//macacajs.github.io/datahub)

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

## Configuration

| key          | type     | description                 | default   |
| ------------ | -------- | --------------------------- | --------- |
| port         | Number   | port for DataHub server     | 9200      |
| mode         | String   | mode for DataHub server     | 'prod'    |
| protocol     | String   | protocol for DataHub server | 'http'    |
| database     | String   | path to file database       | $HOME     |
| store        | String   | path to migrate directory   | undefined |
| view         | Object   | view layer config           | {}        |

Sample: [macaca-datahub.config.js](./macaca-datahub.config.js)

```javascript
module.exports = {
  mode: 'local',

  port: 7001,

  store: path.resolve(__dirname, 'data'),

  view: {
    // set assets base url
    assetsUrl: 'https://npmcdn.com/datahub-view@latest',
  },
};
```

Pass config file[`.js`|`.json`] to DataHub server.

```bash
$ datahub server -c path/to/config.js --verbose
```

## Run with middleware

More about [datahub-proxy-middleware](//github.com/macacajs/datahub-proxy-middleware)

## Run with docker

```bash
$ docker build -t="macaca-datahub" .
$ docker run -it -v any.data:/root/.macaca-datahub/macaca-datahub.production.data -p 9200:9200 macaca-datahub
```

## License

The MIT License (MIT)
