#!/usr/bin/env node

'use strict';

const {
  EOL,
} = require('os');
const _ = require('xutil');
const path = require('path');
const DataHub = require('..');
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

(async () => {
  if (!await update()) return;

  const datahub = new DataHub(options);

  try {
    await datahub.startServer({});
  } catch (error) {
    console.log(chalk.red(`${EOL}DataHub start unsuccessfully: ${error}${EOL}`));
    return;
  }
})();

