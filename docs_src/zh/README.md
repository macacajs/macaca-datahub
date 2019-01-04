---

home: true
heroImage: /logo/logo-color.svg
actionText: Try it Out →
actionLink: /zh/guide/install.html
features:
- title: 多环节覆盖
  details: 支持从本地开发阶段，到集成测试阶段，以及上线前验证阶段的一系列数据环境需求。
- title: 去中心化
  details: DataHub 采用去中心化设计，本地研发阶段每项实例都拥有一份独立的数据。
- title: 数据流动管理
  details: DataHub 采用单向数据流动的原则，使当前项目下的数据状态及时变更。
- title: 文档一致性
  details: DataHub 将 Mock 数据与字段描述整合处理，自动生成接口文档，使得文档能够与交互字段随时保持一致。
- title: 场景管理
  details: DataHub 采用多场景设计，能够根据场景名称进行数据分组，同时提供了场景数据的增、删、改，可以通过 DataHub 的面板界面进行操作。
- title: 快照录入
  details: DataHub 兼备代理功能，会将最近请求的实时响应保存下来，便于归档。也就是说你可以通过已归档的快照随时复现当时的场景。
footer: MIT Licensed | Copyright © 2015-present Macaca

---

## 准备起航

安装

```bash
$ npm i macaca-datahub -g
```

通过如下命令即可开启 DataHub 服务：

```bash
$ datahub server
```

