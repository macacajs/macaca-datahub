'use strict';

const path = require('path');
const _ = require('xutil');
const homeDir = require('os').homedir();

const databasePath = path.join(homeDir, '.macaca-datahub');
_.mkdir(databasePath);

module.exports = {
  dialect: 'sqlite',
  storage: process.env.DATAHUB_DATABASE || path.join(databasePath, 'macaca-datahub.data'),
  logging: false,
  operatorsAliases: false,
  dialectModulePath: require.resolve('sqlite3'),
};
