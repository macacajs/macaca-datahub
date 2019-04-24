# Macaca DataHub

[English Edition](./README.md) | [项目主页](//macacajs.github.io/macaca-datahub)

---

> 开箱即用的全周期的数据环境解决方案 - Macaca DataHub

## 介绍

### 多环节覆盖

DataHub 支持从本地开发阶段，到集成测试阶段，以及上线前验证阶段的一系列数据环境需求，研发与测试工程师只需面向 DataHub 管理数据即可。

<div align="center">
  <img src="https://cdn.nlark.com/yuque/0/2019/png/95383/1556087517572-e20ae953-a33b-414d-99b4-eead40287fc9.png" width="50%" />
</div>

### 去中心化

DataHub 采用去中心化设计，本地研发阶段每项实例都拥有一份独立的数据，数据为明文，可随当前项目版本管理工具进行版本化归档，使得项目数据能做到随开随用，支持离线开发。

另外，每份数据都可向远端服务推送并同步，满足中心化协同的需要。

<div align="center">
  <img src="https://cdn.nlark.com/yuque/0/2019/png/95383/1556087528896-efb81a7c-8f28-4c68-9738-5a0b1131c61d.png" width="50%" />
</div>

### 数据流动管理

DataHub 采用单向数据流动的原则，使当前项目下的数据状态及时变更。

<div align="center">
  <img src="https://cdn.nlark.com/yuque/0/2019/png/95383/1556087394548-1119e4c3-eb64-4e42-8cb8-b4b2a950478d.png" width="50%" />
</div>

### 文档一致性

DataHub 将 Mock 数据与字段描述整合处理，自动生成接口文档。使得文档能够与交互字段随时保持一致。

<div align="center">
  <img src="https://cdn.nlark.com/yuque/0/2019/png/95383/1556087404156-e5c9fdc0-9211-4b2f-8e1e-055b9592bcb6.png" width="75%" />
</div>

### 场景管理

DataHub 采用多场景设计，能够根据场景名称进行数据分组，同时提供了场景数据的增、删、改，可以通过 DataHub 的面板界面进行操作。

Datahub 可以定义动态路径，底层使用的是 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 。

| DataHub API 定义 | 匹配的 URL 路径      |
| ----             | ----                 |
| api1/books       | api1/books           |
| api2/:foo/:bar   | api2/group/project   |
| api3/:id         | api3/fred            |
| api3/:id         | api3/baz             |

<div align="center">
  <img src="https://cdn.nlark.com/yuque/0/2019/png/95383/1556087414287-dd7ee841-564c-434a-8516-df9b1474246c.png" width="75%" />
</div>

### 快照录入

DataHub 兼备代理功能，会将最近请求的实时响应保存下来，便于归档。也就是说你可以通过已归档的快照随时复现当时的场景。

<div align="center">
  <img src="https://cdn.nlark.com/yuque/0/2019/png/95383/1556087541969-d45b0057-0611-4445-8faa-c78f8e9b4f43.png" width="75%" />
</div>

### 自动化测试

通过[场景转换 API](https://macacajs.github.io/macaca-wd/#switchScene) 与测试用例的配合使用，可以做到较高的测试覆盖率。

<div align="center">
  <img src="https://cdn.nlark.com/yuque/0/2019/png/95383/1556087551195-fad4b4e9-64ed-49ad-b05f-bdf2475a38d4.png" width="75%" />
</div>

<div align="center">
  <img src="https://cdn.nlark.com/yuque/0/2019/png/95383/1556087563001-4116b28e-1c7f-4fb6-88dd-0a1bbe4cbe90.png" width="75%" />
</div>

<div align="center">
  <img src="https://cdn.nlark.com/yuque/0/2019/png/95383/1556087580825-d073ffc3-c2ef-4e47-a165-6a4c5f8f87b4.png" width="75%" />
</div>

## License

The MIT License (MIT)
