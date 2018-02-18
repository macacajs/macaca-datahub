#!/usr/bin/env node

'use strict';

const _ = require('xutil');
const path = require('path');
const EOL = require('os').EOL;
const program = require('commander');
const spawn = require('child_process').spawn;

const pkg = require('../package');

const chalk = _.chalk;

program
  .option('-v, --versions', 'show version and exit')
  .option('--verbose', 'show more debugging information')
  .usage('<command> [options] [arguments]')
  .helpInformation = function() {
    return [
      '',
      '  ' + chalk.white(pkg.description),
      '',
      '  Usage:',
      '',
      '    ' + this._name + ' ' + this.usage(),
      '',
      '  Commands:',
      '',
      '    server          start DataHub server',
      '    doctor          detect environment',
      '',
      '  Options:',
      '',
      '' + this.optionHelp().replace(/^/gm, '    '),
      '',
      '  Further help:',
      '',
      '  ' + chalk.underline.white(pkg.homepage),
      '',
      '',
    ].join(EOL);
  };

program.parse(process.argv);

if (program.versions) {
  console.info('%s  %s%s', EOL, pkg.version, EOL);
  process.exit(0);
}

const cmd = program.args[0];

if (!cmd) {
  return program.help();
}

const file = path.join(__dirname, `${pkg.name}-${cmd}.js`);

if (!_.isExistedFile(file)) {
  console.log('%s command `%s` not found', EOL, chalk.yellow(cmd));
  program.help();
  return;
}

const args = program.rawArgs.slice(3);
args.unshift(file);

const bootstrap = spawn('node', args, {
  stdio: [
    process.stdin,
    process.stdout,
    2,
    'ipc',
  ],
});

bootstrap.on('close', code => {
  process.exit('process exited with code ' + code);
});

bootstrap.on('exit', code => {
  process.exit(code);
});

bootstrap.on('message', e => {
  switch (e.signal) {
    case 'kill':
      bootstrap.kill();
      break;
    default :
      break;
  }
});
