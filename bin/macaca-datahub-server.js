#!/usr/bin/env node

'use strict';

const {
  EOL,
} = require('os');
const _ = require('xutil');
const path = require('path');
const DataHub = require('..');
const semver = require('semver');
const program = require('commander');

const update = require('../lib/update');

const {
  chalk,
} = _;

program
  .option('--verbose', 'show more debugging information')
  .option('-p, --protocol <s>', 'set protocol for rpc')
  .option('-c, --config <s>', 'set configuration file')
  .option('-o, --optionstr <s>', 'set options string')
  .parse(process.argv);

let options = {};

if (program.config) {
  const configFile = path.resolve(program.config);

  if (_.isExistedFile(configFile)) {
    console.log(`${EOL}configuration file: ${chalk.cyan(configFile)}`);
    options = Object.assign(options, require(configFile));
  }
}

if (program.optionstr) {
  try {
    options = Object.assign(options, JSON.parse(program.optionstr));
  } catch (e) {
    console.log(e);
  }
}

update()
  .then(() => {
    const version = '8.9.4';

    if (semver.gt(version, process.version)) {
      console.log(chalk.red(`${EOL}Node.js version: ${process.version} is lower than ${version}${EOL}`));
      return;
    }
    const datahub = new DataHub(options);

    datahub.startServer({}, () => {
      console.log('DataHub launch ready');
    });
  });
