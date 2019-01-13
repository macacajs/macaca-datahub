# 在测试用例中使用 DataHub

## 体验一下

通过 [hackernews-datahub](https://github.com/eggjs/examples/tree/master/hackernews-datahub) 来体验如何在测试用例中使用 DataHub。

```bash
$ git clone git@github.com:eggjs/examples.git
$ cd examples/hackernews-datahub
$ npm i
$ npm run dev:e2e
$ npm run test:e2e
```

测试用例跑完之后，可以查看以下内容：

- 覆盖率报告：hackernews-datahub/coverage/index.html
- 通过率报告：hackernews-datahub/reports/index.html

## 如何使用

### 添加配置文件

macaca-datahub.config.js

```javascript
'use strict';

const path = require('path');

module.exports = {
  mode: 'local',
  port: 5678, // must be 5678, same with datahub-nodejs-sdk's default port
  store: path.resolve(__dirname, 'data'),
};
```

mocha.opts

```
--reporter macaca-reporter
--require babel-register
--recursive
--timeout 60000
```

### 添加 helper

```javascript
'use strict';

const wd = require('macaca-wd');

const {
  extendsMixIn,
} = require('macaca-wd/lib/helper');

extendsMixIn(wd);

exports.driver = wd.promiseChainRemote({
  host: 'localhost',
  port: process.env.MACACA_SERVER_PORT || 3456,
});

exports.BASE_URL = 'http://127.0.0.1:7001/';
```

### 编写测试用例

API Document: [https://macacajs.github.io/macaca-wd/](https://macacajs.github.io/macaca-wd/)

```javascript
'use strict';

const {
  driver,
  BASE_URL,
} = require('./helper');

describe('test/datahub.test.js', () => {

  describe('page func testing', () => {

    before(() => {
      return driver
        .initWindow({
          width: 800,
          height: 600,
          deviceScaleFactor: 2,
        });
    });

    afterEach(function() {
      return driver
        .coverage()
        .saveScreenshots(this);
    });

    after(() => {
      return driver
        .switchAllScenes({ // 切换所有 DataHub 场景数据
          hub: 'hackernews',
          pathname: 'topstories.json',
          scene: 'default',
        })
        .openReporter(true)
        .quit();
    });

    it('default render should be ok', async function() {
      return driver
        .switchScene({ // 切换单个接口场景数据
          hub: 'hackernews',
          pathname: 'topstories.json',
          scene: 'default',
        })
        .getUrl(BASE_URL)
        .elementByCss('#wrapper > div.news-view.view.v-transition > div:nth-child(10) > span')
        .hasText('10');
    });

    it('list20 render should be ok', async function() {
      return driver
        .switchScene({
          hub: 'hackernews',
          pathname: 'topstories.json',
          scene: 'list20',
        })
        .getUrl(BASE_URL)
        .elementByCss('#wrapper > div.news-view.view.v-transition > div:nth-child(20) > span')
        .hasText('20');
    });
  });
});
```

