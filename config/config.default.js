'use strict';

const path = require('path');
const _ = require('xutil');

module.exports = appInfo => {

  const config = exports = {};

  config.keys = appInfo.name;

  config.middleware = [
    'errorHandler',
  ];

  config.notfound = {
    pageUrl: '/notfound',
  };

  config.dataHubView = {
    assetsUrl: '//unpkg.com/datahub-view@latest',
  };

  if (process.env.DATAHUB_STORE_PATH) {
    const storeDir = path.resolve(process.env.DATAHUB_STORE_PATH);

    if (_.isExistedDir(storeDir)) {
      config.dataHubStoreDir = storeDir;
    }
  }

  config.security = {
    csrf: {
      enable: false,
    },
  };

  exports.i18n = {
    defaultLocale: 'en_US',
    queryField: 'locale',
    cookieField: 'locale',
    cookieMaxAge: '1y',
  };

  return config;

};

