# 介绍

---

> 全周期的数据环境解决方案 - Macaca DataHub

## 多环节覆盖

DataHub 支持从本地开发阶段，到集成测试阶段，以及上线前验证阶段的一系列数据环境需求，研发与测试工程师只需面向 DataHub 管理数据即可。

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1fokqvum2gsj20s10l70vh.jpg" width="50%" />
</div>

## 去中心化

DataHub 采用去中心化设计，本地研发阶段每项实例都拥有一份独立的数据，数据为明文，可随当前项目版本管理工具进行版本化归档，使得项目数据能做到随开随用，支持离线开发。

另外，每份数据都可向远端服务推送并同步，满足中心化协同的需要。

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9gy1fokxgydf80j20np0cr0ts.jpg" width="50%" />
</div>

## 数据流动管理

DataHub 采用单向数据流动的原则，使当前项目下的数据状态及时变更。

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1fokxgywfajj20mx0g0wfj.jpg" width="50%" />
</div>

## 文档一致性

DataHub 将 Mock 数据与字段描述整合处理，自动生成接口文档。使得文档能够与交互字段随时保持一致。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/bceaad1fly1fwkm6c8rh3j22a41g8jzd.jpg" width="75%" />
</div>

## 场景管理

DataHub 采用多场景设计，能够根据场景名称进行数据分组，同时提供了场景数据的增、删、改，可以通过 DataHub 的面板界面进行操作。

Datahub 可以定义动态路径，底层使用的是 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 。

| DataHub API 定义 | 匹配的 URL 路径      |
| ----             | ----                 |
| api1/books       | api1/books           |
| api2/:foo/:bar   | api2/group/project   |
| api3/:id         | api3/fred            |
| api3/:id         | api3/baz             |

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/bceaad1fly1fwkm6bxcllj22a41g848i.jpg" width="75%" />
</div>

## 快照录入

DataHub 兼备代理功能，会将最近请求的实时响应保存下来，便于归档。也就是说你可以通过已归档的快照随时复现当时的场景。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/bceaad1fly1fwkm6ati9ij21kw13ado5.jpg" width="75%" />
</div>

## 实验特性 - 导入导出

### 打开导入导出功能

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/bceaad1fly1fwkm6dmyoij22b21i8gwb.jpg" width="75%" />
</div>

### 导入导出项目数据

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/bceaad1fly1fwkm6d422ij22a41g8447.jpg" width="75%" />
</div>

### 导入导出接口数据

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/bceaad1fly1fwkm6ctlipj22a41g8484.jpg" width="75%" />
</div>


[更多请到 Macaca 官网](//macacajs.github.io/datahub)
