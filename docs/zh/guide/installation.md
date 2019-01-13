# 安装

## 环境需要

要安装 macaca-datahub, 你需要首先安装 [Node.js](https://nodejs.org)。可以安装 [cnpm](https://npm.taobao.org/) 加快 NPM 模块安装速度。

## 通过 NPM 安装

通过 npm 安装 Macaca DataHub 命令行客户端：

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

## 更多 Docker 用法

临时启动一个服务。

```bash
$ docker run -it --rm \
  --name macaca-datahub \
  -p 9200:9200 \
  -p 9300:9300 \
  macacajs/macaca-datahub
```

挂载本地持久化数据到 Docker 镜像。

```bash
$ docker run -it --rm \
  --name macaca-datahub \
  -v $HOME/.macaca-datahub:/root/.macaca-datahub \
  -p 9200:9200 \
  -p 9300:9300 \
  macacajs/macaca-datahub
```

以后台服务的方式运行。

```bash
$ docker run \
  --name macaca-datahub \
  -v $HOME/.macaca-datahub:/root/.macaca-datahub \
  -p 9200:9200 \
  -p 9300:9300 \
  -d macacajs/macaca-datahub
```

构建基础镜像。

```bash
$ docker build --no-cache --pull -t="macacajs/macaca-datahub" .
```
