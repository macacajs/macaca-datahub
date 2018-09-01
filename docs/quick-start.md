# Macaca Datahub Webpack Tutorial

---

## Installation

Macaca DataHub and DataHub Proxy Middleware are distibuted through npm. To install it, run the following command line:

```bash
$ npm i macaca-datahub --save-dev
$ npm i datahub-proxy-middleware --save-dev
```

## Sample Project

- [webpack-datahub-sample](//github.com/macaca-sample/webpack-datahub-sample)

## Webpack project integrates the DataHub service

```
const path = require('path');
const DataHub = require('macaca-datahub');
const datahubMiddleware = require('datahub-proxy-middleware');

// datahub config
// document: https://github.com/macacajs/macaca-datahub#configuration

const datahubConfig = {
  port: 5678,
  hostname: '127.0.0.1',
  store: path.join(__dirname, '..', 'data'),
  proxy: {
    '^/api': {
      hub: 'sample',
    },
  },
  showBoard: true,
};

const defaultDatahub = new DataHub({
  port: datahubConfig.port,
});

// devServer field
devServer: {
  before: app => {
    datahubMiddleware(app)(datahubConfig);
  },
  after: () => {
    defaultDatahub.startServer(datahubConfig).then(() => {
      console.log('datahub ready');
    });
  },
},
```

You can also get other extra build infomation. If you want more, please tweak the [DataHub-Config](https://github.com/macacajs/macaca-datahub#configuration) file.

## Quick Start

### Step1 - Create New Project

Create a new item named sample.

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueeskabij21yg1bo43p.jpg" width="75%" />
</div>

### Step2 - Add An Interface

Add the interface named test1, request the interface `http://localhost:8080/api/test1` and get the corresponding mock data.

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesm0htj21xm1aidla.jpg" width="75%" />
</div>


### Step3 - Build Interface

Rewrite Response, set the interface response information, and return status code 200 if not set.

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesq1f2j21y21as45g.jpg" width="75%" />
</div>


The scene management, add scenario content corresponding to Response, and the development environment adds multiple scenarios which is conducive to rapid switching.

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesm7o3j21xw1asdl2.jpg" width="75%" />
</div>


The proxy pattern, it can be configured if required.

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesyt33j21y61ay463.jpg" width="75%" />
</div>

Request field description, you can use scheme JSON for validation and choose whether to open validation or not.

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesm12ej21y01aqtew.jpg" width="75%" />
</div>

Response field description, you can use scheme JSON for validation and choose whether to open validation or not. Response descriptions are automatically generated based on scenario information configuration.

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesmb50j21xe1bqq94.jpg" width="75%" />
</div>

### Step4 - Generating Document

Automatically generate documents based on interfaces.

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueet04ehj21yk1b4gst.jpg" width="75%" />
</div>

### Step5 - Build Now

Specific code reference [webpack-datahub-sample](//github.com/macaca-sample/webpack-datahub-sample).

```js
var request = new XMLHttpRequest();
request.open('GET', '/api/test1', true);

request.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status >= 200 && this.status < 400) {
      var json = JSON.parse(this.responseText);
      document.querySelector('#value').innerHTML = json.data;
    } else {}
  }
};

request.send();
```

The mock data is displayed in the page after requesting the `http://localhost:8080/api/test1` interface.

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuugd10nbyj21t21amq9p.jpg" width="75%" />
</div>


### Step6 - History Request Information

This page displays historical request details.

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuuewr0rmyj21xu1aytet.jpg" width="75%" />
</div>
