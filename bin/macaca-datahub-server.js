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
  .parse(process.argv);

let options = {};

if (program.config) {
  const configFile = path.resolve(program.config);

  if (_.isExistedFile(configFile)) {
    console.log(`${EOL}configuration file: ${chalk.cyan(configFile)}`);
    options = Object.assign(options, require(configFile));
  }
}

update()
  .then(() => {
    const datahub = new DataHub(options);

    datahub.startServer(() => {
      console.log('DataHub launch ready');
    });
  });
