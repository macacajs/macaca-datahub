#!/usr/bin/env node

'use strict';

const co = require('co');
const _ = require('xutil');
const path = require('path');
const EOL = require('os').EOL;
const update = require('npm-update');
const program = require('commander');
const macacaLogo = require('macaca-logo');

const DataHub = require('..');
const pkg = require('../package');

const {
  chalk,
  platform,
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
    options = Object.assign(options, require(configFile));
  }
}

const printInfo = function(lines) {
  let maxLength = 0;
  lines.forEach(line => {
    maxLength = line.length > maxLength ? line.length : maxLength;
  });

  const res = [ new Array(maxLength + 7).join('*') ];

  lines.forEach(line => {
    res.push(`*  ${line + new Array(maxLength - line.length + 1).join(' ')}  *`);
  });

  res.push(new Array(maxLength + 7).join('*'));
  console.log(chalk.yellow(`${EOL}${res.join(EOL)}${EOL}`));
};

const init = (error, data) => {
  if (data && data.version && pkg.version !== data.version) {
    if (platform.isOSX && process.stdout.columns >= 99) {
      macacaLogo.print();
    }
    printInfo([ `version ${pkg.version} is outdate`, `run: npm i -g ${pkg.name}@${data.version}` ]);
  }

  const datahub = new DataHub(options);

  datahub.startServer(() => {
    console.log('datahub ready');
  });
};

co(update, {
  pkg,
  host: 'registry.cnpmjs.org', // registry.npmjs.org
  callback: init,
});
