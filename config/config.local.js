'use strict';

module.exports = (/* appInfo */) => {
  const config = exports = {};

  // for datahub-view
  config.dataHubView = {
    assetsUrl: 'http://localhost:8080',
  };

  return config;

};

