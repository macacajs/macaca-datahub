'use strict';

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

