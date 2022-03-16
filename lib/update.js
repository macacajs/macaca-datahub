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
  const inDocker = process.env.RUN_MODE === 'docker';

  const { needUpdate } = await update({
    pkg,
    protocol: 'https',
    host: 'r.cnpmjs.org', // registry.npmjs.org
    version: semver.major(pkg.version),
    silent: inDocker,
  });

  if (!needUpdate && !process.env.CI && platform.isOSX && process.stdout.columns >= 99) {
    macacaLogo.print();
  }

  if (needUpdate && inDocker) {
    printInfo([
      `version ${pkg.version} is outdate`,
      'run: docker pull macacajs/macaca-datahub',
    ]);
  }

  return false;
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
