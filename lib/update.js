'use strict';

const {
  EOL,
} = require('os');
const co = require('co');
const _ = require('xutil');
const semver = require('semver');
const update = require('npm-update');
const macacaLogo = require('macaca-logo');

const pkg = require('../package');

const {
  chalk,
  platform,
} = _;

module.exports = async () => {
  const leastNodeVersion = 'v8.9.4';
  if (semver.gt(leastNodeVersion, process.version)) {
    console.log(chalk.red(`${EOL}Node.js version: ${process.version} is lower than ${leastNodeVersion}${EOL}`));
    return false;
  }

  await co(update({
    pkg,
    host: 'registry.cnpmjs.org', // registry.npmjs.org
    callback: init,
    version: semver.major(pkg.version),
  }));

  return true;
};

function init(error, data) {
  if (data && semver.gt(data.version, pkg.version)) {
    if (platform.isOSX && process.stdout.columns >= 99) {
      macacaLogo.print();
    }
    const inDocker = process.env.RUN_MODE === 'docker';
    printInfo([
      `version ${pkg.version} is outdate`,
      inDocker
        ? 'run: docker pull macacajs/macaca-datahub'
        : `run: npm i -g ${pkg.name}@${data.version}`,
    ]);
  }
}

function printInfo(lines) {
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
}
