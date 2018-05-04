'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.keys = appInfo.name;

  config.dataHubRpcType = 'http';

  return config;
};
