# 快速上手

## 第1步 - 创建项目

创建名字为 sample 项目。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueeskabij21yg1bo43p.jpg" width="75%" />
</div>

## 第2步 - 添加接口

添加 `test1` 接口, 则对 `http://localhost:8080/api/test1` 请求 mock 数据。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesm0htj21xm1aidla.jpg" width="75%" />
</div>


## 第3步 - 接口构建

Rewrite Response, 接口响应状态及header进行设置, 如不进行特殊配置则返回 `200` 状态码。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesq1f2j21y21as45g.jpg" width="75%" />
</div>

场景管理 - 新增场景即接口返回数据 Response， 可添加多个场景方便开发时进行快速切换。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesm7o3j21xw1asdl2.jpg" width="75%" />
</div>

代理模式, 如有代理场景需求, 配置代理模式。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesyt33j21y61ay463.jpg" width="75%" />
</div>

请求字段描述, JSON Schema 格式, 可选是否开启校验, 可选配。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesm12ej21y01aqtew.jpg" width="75%" />
</div>

响应字段描述, JSON Schema 格式, 可选是否开启校验, 根据场景数据自动生成。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueesmb50j21xe1bqq94.jpg" width="75%" />
</div>

## 第4步 - 生成接口文档

接口文档, 根据接口构建信息自动生成。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuueet04ehj21yk1b4gst.jpg" width="75%" />
</div>

## 第5步 - 应用

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
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuugd10nbyj21t21amq9p.jpg" width="75%" />
</div>

## 第6步 - 查看实时快照

对 mock 数据进行请求后可在实时快照中找到对应历史请求信息。

<div align="center">
  <img src="https://ws1.sinaimg.cn/large/796b664dgy1fuuewr0rmyj21xu1aytet.jpg" width="75%" />
</div>

