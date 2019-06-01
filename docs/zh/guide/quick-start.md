# 快速上手

## 创建项目

创建名字为 sample 项目。

<div align="center">
  <img src="/macaca-datahub/assets/1556087099347-92adea0d-cfd1-4319-a825-55db0b39c01a.png" width="75%" />
</div>

## 添加接口

添加 `test1` 接口, 则对 `http://localhost:8080/api/test1` 请求 mock 数据。

<div align="center">
  <img src="/macaca-datahub/assets/1556087110649-c5fb6a9d-0fe6-4e62-8b38-2d16bb0a2947.png" width="75%" />
</div>


## 接口构建

场景管理 - 新增场景即接口返回数据 Response， 可添加多个场景方便开发时进行快速切换。同时，可以对接口响应状态及 header 进行设置, 如不进行特殊配置则返回 `200` 状态码。

<div align="center">
  <img src="/macaca-datahub/assets/1556087121904-1ad45f70-6971-4f3c-bbd9-437094078bd5.png" width="75%" />
</div>

代理模式, 如有代理场景需求, 配置代理模式。

<div align="center">
  <img src="/macaca-datahub/assets/1556087132434-16c7eeb1-c2d3-46fe-b134-1c3ddd7fba95.png" width="75%" />
</div>

请求字段描述, JSON Schema 格式, 可选是否开启校验, 可选配。

<div align="center">
  <img src="/macaca-datahub/assets/1556087143815-69411382-01dc-4fe7-8311-b1b5bf276f98.png" width="75%" />
</div>

响应字段描述, JSON Schema 格式, 可选是否开启校验, 根据场景数据自动生成。

<div align="center">
  <img src="/macaca-datahub/assets/1556087153997-526ee70c-a763-4604-a53f-12796bfe1e74.png" width="75%" />
</div>

## 生成接口文档

接口文档, 根据接口构建信息自动生成。

<div align="center">
  <img src="/macaca-datahub/assets/1556087165144-25f3d3f8-d83e-4876-b112-e134cbc627f9.png" width="75%" />
</div>

## 看看效果

具体代码参照示例项目[webpack-datahub-sample](//github.com/macaca-sample/webpack-datahub-sample)。

```javascript
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

请求结果, 如页面中显示对 `http://localhost:8080/api/test1` 请求结果为上述步骤 mock 数据 `default data`。

<div align="center">
  <img src="/macaca-datahub/assets/1556087178188-5d2ff9a7-d0f4-4f07-b113-26f492925373.png" width="75%" />
</div>

## 查看实时快照

对 mock 数据进行请求后可在实时快照中找到对应历史请求信息。

<div align="center">
  <img src="/macaca-datahub/assets/1556087195119-12fc2430-91a2-451e-9483-0bd4f4bf6860.png" width="75%" />
</div>

