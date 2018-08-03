'use strict';

const {
  EOL,
} = require('os');
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

  const inDocker = process.env.RUN_MODE === 'docker';

  const { needUpdate } = await update({
    pkg,
    host: 'registry.cnpmjs.org', // registry.npmjs.org
    version: semver.major(pkg.version),
    silent: inDocker,
  });

  if (!needUpdate && platform.isOSX && process.stdout.columns >= 99) {
    macacaLogo.print();
  }

  if (needUpdate && inDocker) {
    printInfo([
      `version ${pkg.version} is outdate`,
      'run: docker pull macacajs/macaca-datahub',
    ]);
  }

  return needUpdate;
};

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
