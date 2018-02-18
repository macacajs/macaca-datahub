'use strict';

const {
  EOL,
} = require('os');
const co = require('co');
const _ = require('xutil');
const update = require('npm-update');
const macacaLogo = require('macaca-logo');

const pkg = require('../package');

const {
  chalk,
  platform,
} = _;

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

module.exports = () => {
  return new Promise(resolve => {
    const init = (error, data) => {
      if (data && data.version && pkg.version !== data.version) {
        if (platform.isOSX && process.stdout.columns >= 99) {
          macacaLogo.print();
        }
        printInfo([ `version ${pkg.version} is outdate`, `run: npm i -g ${pkg.name}@${data.version}` ]);
      }
      resolve();
    };

    co(update, {
      pkg,
      host: 'registry.cnpmjs.org', // registry.npmjs.org
      callback: init,
    });
  });
};
