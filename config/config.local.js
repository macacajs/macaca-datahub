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
    defaultLocale: 'en_US',
    queryField: 'locale',
    cookieField: 'locale',
    cookieMaxAge: '1y',
  };

  return config;

};

