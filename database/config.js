'use strict';

const path = require('path');
const _ = require('xutil');

let config;

try {
  config = JSON.parse(process.env.DATAHUB_DATABASE);
} catch (error) {
  config = void 0;
}

const defaultConfig = {
  dialect: 'sqlite',
  logging: false,
  operatorsAliases: false,
  dialectModulePath: require.resolve('sqlite3'),
};

if (config === void 0 || typeof config === 'string') {
  const databasePath = path.join(process.env.HOME, '.macaca-datahub');
  _.mkdir(databasePath);

  const defaultSqliteStorage = config;

  defaultConfig.storage = defaultSqliteStorage || path.join(databasePath, 'macaca-datahub.data');
}


module.exports = typeof config === 'object' ? config : defaultConfig;

