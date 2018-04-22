# macaca-datahub

---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![docker pull][docker-image]][docker-url]

[npm-image]: https://img.shields.io/npm/v/macaca-datahub.svg?style=flat-square
[npm-url]: https://npmjs.org/package/macaca-datahub
[travis-image]: https://img.shields.io/travis/macacajs/macaca-datahub.svg?style=flat-square
[travis-url]: https://travis-ci.org/macacajs/macaca-datahub
[coveralls-image]: https://img.shields.io/codecov/c/github/macacajs/macaca-datahub.svg?style=flat-square
[coveralls-url]: https://codecov.io/gh/macacajs/macaca-datahub
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/macaca-datahub.svg?style=flat-square
[download-url]: https://npmjs.org/package/macaca-datahub
[docker-image]: https://img.shields.io/docker/pulls/macacajs/macaca-datahub.svg?style=flat-square
[docker-url]: https://hub.docker.com/r/macacajs/macaca-datahub/

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

## Schema Syntax

DataHub use [standard JSON schema syntax](//github.com/epoberezkin/ajv), schema must has the `root` node.

```json
{
  "type": "object",
  "required": [
    "success"
  ],
  "properties": {
    "success": {
      "type": "boolean"
    },
    "foo": {
      "type": "object",
      "description": "foo description",
      "default": "",
      "required": [
        "bar"
      ],
      "properties": {
        "bar": {
          "type": "string",
          "description": "bar description"
        }
      }
    }
  }
}
```

live demo: [webpack-datahub-sample](//github.com/macaca-sample/webpack-datahub-sample)

## Samples For Multi platforms

- [android-datahub-sample](//github.com/app-bootstrap/android-app-bootstrap) - Android sample for DataHub
- [ios-datahub-sample](//github.com/app-bootstrap/ios-app-bootstrap) - iOS sample for DataHub
- [antd-sample](//github.com/macaca-sample/antd-sample) - Ant Design sample for DataHub
- [angular-datahub-sample](//github.com/macaca-sample/angular-datahub-sample) - Angular's ng toolchain sample for DataHub

## Run with middleware

More about [datahub-proxy-middleware](//github.com/macacajs/datahub-proxy-middleware)

## Run with docker

Common usage

```bash
$ docker run -it -p 9200:9200 -p 9300:9300 macacajs/macaca-datahub
```

## Build docker image

Build base mirror.

```bash
$ docker build -t="macacajs/macaca-datahub" .
```

Run as standalone just once service.

```bash
docker run -it -p 9200:9200 -p 9300:9300 macacajs/macaca-datahub
```

Run with existed datahub's database in your host.

```bash
$ docker run -it -v ~/.macaca-datahub/macaca-datahub.data:/root/.macaca-datahub/macaca-datahub.data -p 9200:9200 -p 9300:9300 macacajs/macaca-datahub
```

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars1.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/2139038?v=4" width="100px;"/><br/><sub><b>zhangyuheng</b></sub>](https://github.com/zhangyuheng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/11460601?v=4" width="100px;"/><br/><sub><b>zivyll</b></sub>](https://github.com/zivyll)<br/>|[<img src="https://avatars2.githubusercontent.com/u/8085088?v=4" width="100px;"/><br/><sub><b>brucejcw</b></sub>](https://github.com/brucejcw)<br/>|[<img src="https://avatars1.githubusercontent.com/u/17233599?v=4" width="100px;"/><br/><sub><b>Chan-Chun</b></sub>](https://github.com/Chan-Chun)<br/>|[<img src="https://avatars2.githubusercontent.com/u/227713?v=4" width="100px;"/><br/><sub><b>atian25</b></sub>](https://github.com/atian25)<br/>
| :---: | :---: | :---: | :---: | :---: | :---: |
|[<img src="https://avatars3.githubusercontent.com/u/3807955?v=4" width="100px;"/><br/><sub><b>BernardTolosajr</b></sub>](https://github.com/BernardTolosajr)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto upated at `Sun Apr 22 2018 18:34:37 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## License

The MIT License (MIT)
