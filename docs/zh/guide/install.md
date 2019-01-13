# 安装

## 环境需要

要安装 macaca-datahub, 你需要首先安装 [Node.js](https://nodejs.org)。 国内用户可以安装 [cnpm](https://npm.taobao.org/) 加快 NPM 模块安装速度。

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

