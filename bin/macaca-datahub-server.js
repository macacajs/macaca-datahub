#!/usr/bin/env node

'use strict';

const _ = require('xutil');
const path = require('path');
const program = require('commander');

const DataHub = require('..');

program
  .option('--verbose', 'show more debugging information')
  .option('-c, --config <s>', 'set configuration file')
  .parse(process.argv);

let options = {};

if (program.config) {
  const configFile = path.resolve(program.config);

  if (_.isExistedFile(configFile)) {
    options = Object.assign(options, require(configFile));
  }
}

const datahub = new DataHub(options);

datahub.startServer(() => {
  console.log('ready');
});
