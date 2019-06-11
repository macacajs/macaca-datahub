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

[中文版](./README.zh.md) | [Offical Site](//macacajs.github.io/macaca-datahub)

---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![docker pull][docker-pull-image]][docker-url]
[![docker pull][docker-size-image]][docker-url]
[![docker pull][docker-layers-image]][docker-url]

[npm-image]: https://img.shields.io/npm/v/macaca-datahub.svg?style=flat-square&logo=npm
[npm-url]: https://npmjs.org/package/macaca-datahub
[travis-image]: https://img.shields.io/travis/macacajs/macaca-datahub.svg?style=flat-square&logo=travis
[travis-url]: https://travis-ci.org/macacajs/macaca-datahub
[codecov-image]: https://img.shields.io/codecov/c/github/macacajs/macaca-datahub.svg?style=flat-square&logo=javascript
[codecov-url]: https://codecov.io/gh/macacajs/macaca-datahub
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square&logo=node.js
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/macaca-datahub.svg?style=flat-square&logo=npm
[download-url]: https://npmjs.org/package/macaca-datahub
[docker-pull-image]: https://img.shields.io/docker/pulls/macacajs/macaca-datahub.svg?style=flat-square&logo=docker
[docker-size-image]: https://img.shields.io/microbadger/image-size/macacajs/macaca-datahub.svg?style=flat-square&logo=docker
[docker-layers-image]: https://img.shields.io/microbadger/layers/macacajs/macaca-datahub.svg?style=flat-square&logo=docker
[docker-url]: https://hub.docker.com/r/macacajs/macaca-datahub/

> Continuous data provider for development, testing, staging and production.

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars1.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/2139038?v=4" width="100px;"/><br/><sub><b>zhangyuheng</b></sub>](https://github.com/zhangyuheng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/11460601?v=4" width="100px;"/><br/><sub><b>zivyangll</b></sub>](https://github.com/zivyangll)<br/>|[<img src="https://avatars2.githubusercontent.com/u/8085088?v=4" width="100px;"/><br/><sub><b>brucejcw</b></sub>](https://github.com/brucejcw)<br/>|[<img src="https://avatars3.githubusercontent.com/u/3807955?v=4" width="100px;"/><br/><sub><b>BernardTolosajr</b></sub>](https://github.com/BernardTolosajr)<br/>|[<img src="https://avatars3.githubusercontent.com/u/15025212?v=4" width="100px;"/><br/><sub><b>zhuyali</b></sub>](https://github.com/zhuyali)<br/>|
| :---: | :---: | :---: | :---: | :---: | :---: |
|[<img src="https://avatars1.githubusercontent.com/u/17233599?v=4" width="100px;"/><br/><sub><b>Chan-Chun</b></sub>](https://github.com/Chan-Chun)<br/>|[<img src="https://avatars2.githubusercontent.com/u/227713?v=4" width="100px;"/><br/><sub><b>atian25</b></sub>](https://github.com/atian25)<br/>|[<img src="https://avatars3.githubusercontent.com/u/1209810?v=4" width="100px;"/><br/><sub><b>paradite</b></sub>](https://github.com/paradite)<br/>|[<img src="https://avatars1.githubusercontent.com/u/15955374?v=4" width="100px;"/><br/><sub><b>gaius-qi</b></sub>](https://github.com/gaius-qi)<br/>|[<img src="https://avatars0.githubusercontent.com/u/465125?v=4" width="100px;"/><br/><sub><b>yesmeck</b></sub>](https://github.com/yesmeck)<br/>|[<img src="https://avatars0.githubusercontent.com/u/156269?v=4" width="100px;"/><br/><sub><b>fengmk2</b></sub>](https://github.com/fengmk2)<br/>|
[<img src="https://avatars2.githubusercontent.com/u/2972143?v=4" width="100px;"/><br/><sub><b>nightink</b></sub>](https://github.com/nightink)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Tue Jun 11 2019 11:55:36 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## Introduction

Macaca DataHub is a continuous data provider for development, testing, staging and production.

### A Comprehensive Solution

DataHub is born to solving the lifecycle needs of mock/testing data of software development, from development, testing, staging to final production. Software engineers and test engineers use DataHub to manage their mock/testing data.

<div align="center">
  <img src="https://macacajs.github.io/macaca-datahub/assets/1556087483456-13b5cae9-1d6c-4cd5-a331-12c729c45a67.png" width="50%" />
</div>

### Decentralization

DataHub is flexible with how and where mock/testing data is stored.

You can use a local instance of Datahub on your local machine to manage your local testing/mock data during development. The mock/testing data is in plain text. It can be versioned and archived with any version control software, together with your project files.

In addition, the local mock/testing data can be pushed and synchronized to a remote Datahub server to meet the needs of data sharing and collaboration.

<div align="center">
  <img src="https://macacajs.github.io/macaca-datahub/assets/1556087494964-b9c2be28-4a7d-41ad-8e26-06fda41e1623.png" width="50%" />
</div>

### Data Flow Management

DataHub adopts the principle of unidirectional data flow to make sure you will always get the latest data.

<div align="center">
  <img src="https://macacajs.github.io/macaca-datahub/assets/1556087504806-35d3b20c-8aef-450d-a069-9581ba117321.png" width="50%" />
</div>

### Consistency Between API Document and Mock Data

Datahub can also automatically generate an API document from your mock/testing data, to help keep your API document up to date and consistent with your mock data.

<div align="center">
  <img src="https://macacajs.github.io/macaca-datahub/assets/1556087321021-f5514eb2-62f6-484b-ad58-24433c7f8906.png" width="75%" />
</div>

### Dashboard

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
  <img src="https://macacajs.github.io/macaca-datahub/assets/1556087382255-adf7e3a6-60d8-42f9-b6b1-6b27917fa038.png" width="75%" />
</div>

### Save Snapshot

DataHub can save the response of each request by taking snapshot. You can use the archieved snapshot to find out what happened.

<div align="center">
  <img src="https://macacajs.github.io/macaca-datahub/assets/1556087335320-a477734e-e661-4045-b702-58904a5dfd0c.png" width="75%" />
</div>

### Automation Testing

Through the seamless integration of the [switchScene(scenario) API](https://macacajs.github.io/macaca-wd/#switchScene) in test cases, higher test coverage can be achieved.

<div align="center">
  <img src="https://macacajs.github.io/macaca-datahub/assets/1556087346280-f26a2534-8898-4538-bf9c-928c73b2ed62.png" width="75%" />
</div>

<div align="center">
  <img src="https://macacajs.github.io/macaca-datahub/assets/1556087359122-6abfe674-771a-45dd-a008-0271df7b05e8.png" width="75%" />
</div>

<div align="center">
  <img src="https://macacajs.github.io/macaca-datahub/assets/1556087370670-c4d89f7f-2c06-4e10-915f-99562f80fac9.png" width="75%" />
</div>

## License

The MIT License (MIT)
