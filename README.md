<p align="center">
  <a href="//macacajs.github.io">
    <img
      alt="Macaca"
      src="https://macacajs.github.io/macaca-datahub/logo/logo-color.svg"
      width="160"
    />
  </a>
</p>

# Macaca DataHub

[中文版](./README.zh.md)

---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![docker pull][docker-pull-image]][docker-url]
[![docker pull][docker-size-image]][docker-url]
[![docker pull][docker-layers-image]][docker-url]

[npm-image]: https://img.shields.io/npm/v/macaca-datahub.svg?style=flat-square
[npm-url]: https://npmjs.org/package/macaca-datahub
[travis-image]: https://img.shields.io/travis/macacajs/macaca-datahub.svg?style=flat-square&logo=travis
[travis-url]: https://travis-ci.org/macacajs/macaca-datahub
[codecov-image]: https://img.shields.io/codecov/c/github/macacajs/macaca-datahub.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/macacajs/macaca-datahub
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/macaca-datahub.svg?style=flat-square
[download-url]: https://npmjs.org/package/macaca-datahub
[docker-pull-image]: https://img.shields.io/docker/pulls/macacajs/macaca-datahub.svg?style=flat-square&logo=dockbit
[docker-size-image]: https://img.shields.io/microbadger/image-size/marmotjs/marmot-web.svg?style=flat-square&logo=dockbit
[docker-layers-image]: https://img.shields.io/microbadger/layers/macacajs/macaca-datahub.svg?style=flat-square&logo=dockbit
[docker-url]: https://hub.docker.com/r/macacajs/macaca-datahub/

> Just enjoy the data out-of-the-box.📦

## Introduction

Macaca DataHub is a continuous data provider for development, testing, staging and production.

### A Comprehensive Solution

DataHub is born to solving the lifecycle needs of mock/testing data of software development, from development, testing, staging to final production. Software engineers and test engineers use DataHub to manage their mock/testing data.

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1fokqvum2gsj20s10l70vh.jpg" width="50%" />
</div>

### Decentralization

DataHub is flexible with how and where mock/testing data is stored.

You can use a local instance of Datahub on your local machine to manage your local testing/mock data during development. The mock/testing data is in plain text. It can be versioned and archived with any version control software, together with your project files.

In addition, the local mock/testing data can be pushed and synchronized to a remote Datahub server to meet the needs of data sharing and collaboration.

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9gy1fokxgydf80j20np0cr0ts.jpg" width="50%" />
</div>

### Data Flow Management

DataHub adopts the principle of unidirectional data flow to make sure you will always get the latest data.

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1fokxgywfajj20mx0g0wfj.jpg" width="50%" />
</div>

### Consistency Between API Document and Mock Data

Datahub can also automatically generate an API document from your mock/testing data, to help keep your API document up to date and consistent with your mock data.

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1fpbmdx2whdj21kw13a7fa.jpg" width="75%" />
</div>

### DataHub Dashboard

DataHub adopts multi-scenario design, can group data according to the scene name, and provide scene data addition, deletion, and change, and can operate through DataHub's panel interface.

DataHub provides a dashboard for you to manage your data. You can group data by scene, or by stage such as development, testing, or staging. Datahub provides standard CRUD funtions.

Datahub use [path-to-regexp](https://github.com/pillarjs/path-to-regexp) for dynamic path matching.

API name example:

| DataHub API name | matched request path |
| ----             | ----                 |
| api1/books       | api1/books           |
| api2/:foo/:bar   | api2/group/project   |
| api3/:id         | api3/fred            |
| api3/:id         | api3/baz             |

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1fpbmdxv2ehj21kw13awr0.jpg" width="75%" />
</div>

### Save Snapshot

DataHub can save the response of each request by taking snapshot. You can use the archieved snapshot to find out what happened.

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1fpbmdy5o65j21kw13a7i2.jpg" width="75%" />
</div>

[More intro](//macacajs.github.io/datahub)

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
      "type": "boolean",
      "description": "server side success"
    },
    "data": {
      "type": "array",
      "description": "data field",
      "required": [
        "age",
        "key",
        "name",
        "address"
      ],
      "items": [
        {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "key": {
              "type": "string",
              "description": "key description"
            },
            "name": {
              "type": "string",
              "description": "name description"
            },
            "age": {
              "type": "number",
              "description": "age description"
            },
            "address": {
              "type": "string",
              "description": "address description"
            }
          }
        }
      ]
    },
    "errorMessage": {
      "type": "string",
      "description": "error message description"
    }
  }
}
```

## Project Integration

[Quick start in your web project](./docs/quick-start-with-webpack.md)

- [android-datahub-sample](//github.com/app-bootstrap/android-app-bootstrap) - Android sample for DataHub
- [ios-datahub-sample](//github.com/app-bootstrap/ios-app-bootstrap) - iOS sample for DataHub
- [antd-sample](//github.com/macaca-sample/antd-sample) - Ant Design sample for DataHub
- [angular-datahub-sample](//github.com/macaca-sample/angular-datahub-sample) - Angular's ng toolchain sample for DataHub
- [webpack-datahub-sample](//github.com/macaca-sample/webpack-datahub-sample)

### Integration with webpack-dev-sever

More about [datahub-proxy-middleware](//github.com/macacajs/datahub-proxy-middleware)

### Integration with Egg.js

More about [egg-datahub](//github.com/macacajs/egg-datahub)

### Integration with UmiJS

[UmiJS](//github.com/umijs/umi/tree/master/packages/umi-plugin-datahub) is a blazing-fast next.js-like framework for React apps, and it's friendly to [ant-design](//github.com/ant-design/ant-design) project.

- [umi-examples](//github.com/umijs/umi-examples/tree/master/eleme-demo)

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
$ docker run -it \
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

## SDKs

DataHub provides SDKs in multiple languages for easy integration with your test code.

- [Node.js](//github.com/macacajs/datahub-nodejs-sdk)
- [Java](//github.com/macacajs/datahub-java-sdk)
- [Python](//github.com/macacajs/datahub-python-sdk)

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars1.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/2139038?v=4" width="100px;"/><br/><sub><b>zhangyuheng</b></sub>](https://github.com/zhangyuheng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/11460601?v=4" width="100px;"/><br/><sub><b>zivyangll</b></sub>](https://github.com/zivyangll)<br/>|[<img src="https://avatars2.githubusercontent.com/u/8085088?v=4" width="100px;"/><br/><sub><b>brucejcw</b></sub>](https://github.com/brucejcw)<br/>|[<img src="https://avatars3.githubusercontent.com/u/3807955?v=4" width="100px;"/><br/><sub><b>BernardTolosajr</b></sub>](https://github.com/BernardTolosajr)<br/>|[<img src="https://avatars1.githubusercontent.com/u/17233599?v=4" width="100px;"/><br/><sub><b>Chan-Chun</b></sub>](https://github.com/Chan-Chun)<br/>
| :---: | :---: | :---: | :---: | :---: | :---: |
|[<img src="https://avatars2.githubusercontent.com/u/227713?v=4" width="100px;"/><br/><sub><b>atian25</b></sub>](https://github.com/atian25)<br/>|[<img src="https://avatars1.githubusercontent.com/u/15955374?v=4" width="100px;"/><br/><sub><b>gaius-qi</b></sub>](https://github.com/gaius-qi)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto upated at `Sun Sep 02 2018 21:50:15 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## License

The MIT License (MIT)
