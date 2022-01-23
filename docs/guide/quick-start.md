# Quick Start

## Create New Project

Create a new item named sample.

<div align="center">
  <img src="/macaca-datahub/assets/20220123234308.png" width="90%" />
</div>

## Create An Interface Group

A default interface group will be created when a new project is created, and interface groups can be added and modified later as required.

<div align="center">
  <img src="/macaca-datahub/assets/add-interface-group.gif" width="90%" />
</div>

## Add An Interface

Add the interface named `test1`, request the interface `http://localhost:8080/api/test1` and get the corresponding mock data, Interface grouping can be selected when adding, which is convenient for management.

<div align="center">
  <img src="/macaca-datahub/assets/20220123235130.png" width="90%" />
</div>

## Create An Scene Group

When creating a new interface, a default scene group will be created for the interface, and you can add and modify scene groups later as required.

<div align="center">
  <img src="/macaca-datahub/assets/add-scene-group.gif" width="90%" />
</div>

## Build Interface

The scene management, add scenario content corresponding to Response, and the development environment adds multiple scenarios which is conducive to rapid switching. You can set the interface response information, and return status code `200` if not set. You can select scene groups when adding scenes for easy management.

<div align="center">
  <img src="/macaca-datahub/assets/20220124000424.png" width="90%" />
</div>

The proxy pattern, it can be configured if required.

<div align="center">
  <img src="/macaca-datahub/assets/1556086751482-91206dc4-3a37-4eea-b0ea-f4a8fb5417f1.png" width="75%" />
</div>

Request field description, you can use scheme JSON for validation and choose whether to open validation or not.

<div align="center">
  <img src="/macaca-datahub/assets/1556086764565-8121c57d-ce87-447f-af04-fff78c1ecffe.png" width="75%" />
</div>

Response field description, you can use scheme JSON for validation and choose whether to open validation or not. Response descriptions are automatically generated based on scenario information configuration.

<div align="center">
  <img src="/macaca-datahub/assets/1556086780328-a8a4e342-bfd2-4fc0-83c8-9ed67de49a4f.png" width="75%" />
</div>

## Generating Document

Automatically generate documents based on interfaces.

<div align="center">
  <img src="/macaca-datahub/assets/1556086792418-1274ffe0-4e3d-4941-9fc9-0a045adcbb51.png" width="75%" />
</div>

## Try Now

Specific code reference [webpack-datahub-sample](//github.com/macaca-sample/webpack-datahub-sample).

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

The mock data is displayed in the page after requesting the `http://localhost:8080/api/test1` interface.

<div align="center">
  <img src="/macaca-datahub/assets/1556086807886-63322b53-8f39-4dba-bdc8-2d509d9e7c33.png" width="75%" />
</div>


## History Request Information

This page displays historical request details.

<div align="center">
  <img src="/macaca-datahub/assets/1556086820352-321ae85d-b7b5-4762-9437-c8b5a9edf7d7.png" width="75%" />
</div>

