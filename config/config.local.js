'use strict';

module.exports = (/* appInfo */) => {
  const config = exports = {};

  // for datahub-view
  config.datahubView = {
    assetsDir: 'http://localhost:8080',
  };

  return config;

};
