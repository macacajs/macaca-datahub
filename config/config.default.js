'use strict';

const _ = require('xutil');
const fs = require('fs');
const path = require('path');

const sequelizeConfig = require('../database/config');

module.exports = (appInfo) => {
  const config = (exports = {});

  config.siteFile = {
    '/favicon.ico': 'https://macacajs.github.io/macaca-datahub/logo/favicon.ico',
  };

  config.keys = appInfo.name;

  config.middleware = ['contextCors', 'exportData', 'errorHandler'];

  config.multipart = {
    fileSize: '1gb',
    mode: 'stream',
    whitelist: () => true,
  };

  config.exportData = {
    match(ctx) {
      const datahubClient = ctx.get('x-datahub-client');
      return (
        datahubClient === 'datahub-view' &&
        ['/api/project', '/api/interface', '/api/scene', '/api/schema'].some((path) => ctx.path.startsWith(path)) &&
        ['POST', 'PUT', 'DELETE'].includes(ctx.method)
      );
    },
  };

  config.notfound = {
    pageUrl: '/notfound',
  };

  config.featureConfig = {
    enableJavascript: process.env.ENABLE_JAVASCRIPT === 'Y',
    enableRequestProxy: process.env.ENABLE_REQUEST_PROXY === 'Y',
    enableDatahubLogger: process.env.ENABLE_DATAHUB_LOGGER === 'Y',
  };

  config.dataHubRpcType = process.env.DATAHUB_RPC_PROTOCOL || 'http';

  config.dataHubSocket = {
    port: process.env.DATAHUB_SOCKET_IO_PORT || 9300,
  };

  config.security = {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
    },
    methodnoallow: {
      enable: false,
    },
  };

  config.logger = {
    consoleLevel: 'ERROR',
  };

  config.i18n = {
    defaultLocale: 'en_US',
    queryField: 'locale',
    cookieField: 'locale',
    cookieMaxAge: '1y',
  };

  config.bodyParser = {
    formLimit: '1gb',
    jsonLimit: '1gb',
  };

  config.sequelize = sequelizeConfig;

  config.modelCommonOption = {
    underscored: false,
  };

  if (process.env.DATAHUB_STORE_PATH) {
    const storeDir = path.resolve(process.env.DATAHUB_STORE_PATH);
    if (!_.isExistedDir(storeDir)) fs.mkdirSync(storeDir);
    config.exportArchiveBaseDir = storeDir;
  }

  config.exportExcludeAttributes = ['createdAt', 'updatedAt'];

  config.static = {
    prefix: '',
    dir: path.resolve(__dirname, '..', 'view'),
  };

  return config;
};
