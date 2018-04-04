'use strict';

module.exports = (/* appInfo */) => {
  const config = exports = {};

  // for datahub-view
  config.dataHubView = {
    assetsUrl: 'http://localhost:8080',
  };

  exports.logger = {
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

