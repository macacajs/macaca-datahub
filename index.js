'use strict';

const {
  ipv4,
  chalk,
  detectPort,
} = require('xutil');
const path = require('path');
const EOL = require('os').EOL;
const eggServer = require('egg');

const defaultOptions = {
  port: 9200,
  mode: 'production',
  protocol: 'http',
};

class DataHub {
  constructor(options = {}) {
    this.options = Object.assign(defaultOptions, options);
  }

  startServer() {
    const args = Array.prototype.slice.call(arguments);
    const options = Object.assign(this.options, args[0] || {});

    if (options.database) {
      process.env.DATAHUB_DATABASE = options.database;
    }

    if (options.store) {
      process.env.DATAHUB_STORE_PATH = path.resolve(options.store);
    }

    if (options.view && options.view.assetsUrl) {
      process.env.DATAHUB_VIEW_CONFIG_ASSETSURL = options.view.assetsUrl;
    }

    process.env.DATAHUB_RPC_PROTOCOL = options.protocol;
    process.env.EGG_SERVER_ENV = options.mode;
    process.env.EGG_MASTER_LOGGER_LEVEL = 'ERROR';

    const promise = detectPort(options.port)
      .then(_port => {
        const host = chalk.cyan.underline(`http://${ipv4}:${(_port)}`);
        console.log(`${EOL}DataHub server start at: ${host}${EOL}`);
        return eggServer.startCluster({
          workers: 1,
          port: _port,
          baseDir: __dirname,
        });
      });

    if (args.length > 1) {
      const cb = args[1];

      return promise.then(data => {
        cb.call(this, null, data);
      }).catch(err => {
        cb.call(this, `Error occurred: ${err}`);
      });
    }
    return promise;

  }
}

module.exports = DataHub;
