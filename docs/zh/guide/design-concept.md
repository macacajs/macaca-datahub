# 设计理念

## 多环节覆盖

支持从本地开发阶段，到集成测试阶段，以及上线前验证阶段的一系列数据环境需求，研发与测试工程师只需面向 DataHub 管理数据即可。

![](/macaca-datahub/assets/1556087441429-3bfe13af-c823-45a4-b24c-eb534a0e4728.png)

## 去中心化

采用去中心化设计，本地研发阶段每项实例都拥有一份独立的数据，数据为明文，可随当前项目版本管理工具进行版本化归档，使得项目数据能做到随开随用，支持离线开发。

另外，每份数据都可向远端服务推送并同步，满足中心化协同的需要。

![](/macaca-datahub/assets/1556087451934-6ca4caf4-ff6b-4c2f-9879-c4839e79f2cb.png)

## 数据流动管理

采用单向数据流动的原则，使当前项目下的数据状态及时变更。

![](/macaca-datahub/assets/1556086912538-d27df977-e3c6-4b66-968b-bb3163150dcc.png)

## 文档一致性

DataHub 将 Mock 数据与字段描述整合处理，自动生成接口文档。使得文档能够与交互字段随时保持一致。

![](/macaca-datahub/assets/1556086928867-6735d9f0-49bc-452f-b477-f0dd28a6228a.png)

## 场景管理

DataHub 采用多场景设计，能够根据场景名称进行数据分组，同时提供了场景数据的增、删、改，可以通过 DataHub 的面板界面进行操作。

Datahub 可以定义动态路径，底层使用的是 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 。

| DataHub API 定义 | 匹配的 URL 路径      |
| ----             | ----                 |
| api1/books       | api1/books           |
| api2/:foo/:bar   | api2/group/project   |
| api3/:id         | api3/fred            |
| api3/:id         | api3/baz             |

![](/macaca-datahub/assets/1556086944659-3f800847-8cf2-41b4-a252-cc1388821a36.png)

## 快照录入

DataHub 兼备代理功能，会将最近请求的实时响应保存下来，便于归档。也就是说你可以通过已归档的快照随时复现当时的场景。

![](/macaca-datahub/assets/1556086955580-f1829ac9-f0be-4ff4-b8b6-899e1012274c.png)

### 自动化测试

通过[场景转换 API](https://macacajs.github.io/macaca-wd/#switchScene) 与测试用例的配合使用，可以做到较高的测试覆盖率。

![](/macaca-datahub/assets/1556086969521-a354d792-5399-4b48-ac4b-715a389e1b2b.png)

![](/macaca-datahub/assets/1556086985552-fb44ad67-2697-415a-a1ac-955d1186edef.png)

![](/macaca-datahub/assets/1556087001104-3da55088-824b-4ed4-a2be-97774f429561.png)
