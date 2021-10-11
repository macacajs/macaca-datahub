'use strict';

module.exports = (/* appInfo */) => {
  const config = exports = {};

  // config.exportArchiveBaseDir = require('path').join(__dirname, '..', 'data');

  config.logger = {
    consoleLevel: 'INFO',
  };

  config.i18n = {
    defaultLocale: 'zh_CN',
    queryField: 'locale',
    cookieField: 'locale',
    cookieMaxAge: '1y',
  };

  return config;

};

