# Macaca DataHub

[English Edition](./README.md)

---

> 全周期的数据环境解决方案 - Macaca DataHub

## 介绍

### 多环节覆盖

DataHub 支持从本地开发阶段，到集成测试阶段，以及上线前验证阶段的一系列数据环境需求，研发与测试工程师只需面向 DataHub 管理数据即可。

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1fokqvum2gsj20s10l70vh.jpg" width="50%" />
</div>

### 去中心化

DataHub 采用去中心化设计，本地研发阶段每项实例都拥有一份独立的数据，数据为明文，可随当前项目版本管理工具进行版本化归档，使得项目数据能做到随开随用，支持离线开发。

另外，每份数据都可向远端服务推送并同步，满足中心化协同的需要。

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9gy1fokxgydf80j20np0cr0ts.jpg" width="50%" />
</div>

### 数据流动管理

DataHub 采用单向数据流动的原则，使当前项目下的数据状态及时变更。

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1fokxgywfajj20mx0g0wfj.jpg" width="50%" />
</div>

### 文档一致性

DataHub 将 Mock 数据与字段描述整合处理，自动生成接口文档。使得文档能够与交互字段随时保持一致。

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9gy1fpbm9w2ohoj21kw13ak2r.jpg" width="75%" />
</div>

### 场景管理

DataHub 采用多场景设计，能够根据场景名称进行数据分组，同时提供了场景数据的增、删、改，可以通过 DataHub 的面板界面进行操作。

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9gy1fpbm9x6ctkj21kw13a16k.jpg" width="75%" />
</div>

### 快照录入

DataHub 兼备代理功能，会将最近请求的实时响应保存下来，便于归档。也就是说你可以通过已归档的快照随时复现当时的场景。

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9gy1fpbm9xwssnj21kw13adu9.jpg" width="75%" />
</div>

[更多请到 Macaca 官网](//macacajs.github.io/datahub)

## 安装

通过 npm 安装Macaca DataHub 命令行客户端：

```bash
$ npm i macaca-datahub -g
```

## 一键启动

通过如下命令即可开启 DataHub 服务：

```bash
$ datahub server
```

DataHub 启动后会定期备份数据库到数据库文件所在的目录下，备份文件的前缀为 `macaca-datahub.data-backup-`

## 使用 Docker 启动

```bash
$ docker run -it -p 9200:9200 -p 9300:9300 macacajs/macaca-datahub
```

## 配置选项

| 字段名       | 类型     | 描述                        | 默认      |
| ------------ | -------- | --------------------------- | --------- |
| port         | Number   | DataHub 服务启动端口        | 9200      |
| mode         | String   | DataHub 服务启动模式        | 'prod'    |
| protocol     | String   | DataHub 服务交互协议        | 'http'    |
| database     | String   | DataHub 数据库地址          | $HOME     |
| store        | String   | 数据流归档文件路径          | undefined |
| view         | Object   | 界面静态文件访问地址配置    | {}        |

配置示例: [macaca-datahub.config.js](./macaca-datahub.config.js)

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

可以通过指定 [`.js`|`.json`] 后缀格式的配置文件。

```bash
$ datahub server -c path/to/config.js --verbose
```

## Schema 语法

DataHub 采用 [标准的 JSON schema 语法](//github.com/epoberezkin/ajv) 来描述接口，用以校验数据和自动生成文档，schema 需要以下格式： 

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

webpack 项目可作为示例： [webpack-datahub-sample](//github.com/macaca-sample/webpack-datahub-sample)

## 项目集成示例

Macaca DataHub 可与所有类型的iOS, Android 和 Web 工程集成，以下有些参考示例：

- [android-datahub-sample](//github.com/app-bootstrap/android-app-bootstrap) - Android 的例子
- [ios-datahub-sample](//github.com/app-bootstrap/ios-app-bootstrap) - iOS 的例子
- [antd-sample](//github.com/macaca-sample/antd-sample) - Ant Design 的例子
- [angular-datahub-sample](//github.com/macaca-sample/angular-datahub-sample) - Angular 的例子

### 中间件集成

Macaca DataHub 可通过中间件形式集成到 Webpack 项目中，请见中间件文档：[datahub-proxy-middleware](//github.com/macacajs/datahub-proxy-middleware)

### Egg.js 集成

更多关于 [egg-datahub](//github.com/macacajs/egg-datahub)

### UmiJS 集成

[UmiJS](//github.com/umijs/umi/tree/master/packages/umi-plugin-datahub) 极快的类 Next.js 的 React 应用框架。

- [umi-examples](//github.com/umijs/umi-examples/tree/master/eleme-demo)

## 构建 Docker 镜像

如果你使用 Docker ，可通过以下命令构建基础镜像：

```bash
$ docker build -t="macacajs/macaca-datahub" .
```

启动服务：

```bash
docker run -it -p 9200:9200 -p 9300:9300 macacajs/macaca-datahub
```

启动服务前建议挂载本地数据文件，方便数据存档：

```bash
$ docker run -it -v ~/.macaca-datahub/macaca-datahub.data:/root/.macaca-datahub/macaca-datahub.data -p 9200:9200 -p 9300:9300 macacajs/macaca-datahub
```

## SDK 接入

DataHub 提供多个语言平台的 SDK，方便与你的主工程或测试工程集成，也方便通过 API 形式操作 DataHub。

- [Node.js](//github.com/macacajs/datahub-nodejs-sdk)
- [Java](//github.com/macacajs/datahub-java-sdk)
- [Python](//github.com/macacajs/datahub-python-sdk)

## License

The MIT License (MIT)
