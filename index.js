'use strict';

const { ipv4, chalk, detectPort, mkdir, semver } = require('xutil');
const path = require('path');
const EOL = require('os').EOL;
const execa = require('execa');
const eggServer = require('egg');
const homeDir = require('os').homedir();

const MIN_PROXY_MIDDLEWARE_VERSION = '4.0.0';

const defaultOptions = {
  port: 9200,
  mode: 'unittest',
  protocol: 'http',
  socketIoPort: 9300,
  enableJavascript: true,
  enableRequestProxy: true,
};

class DataHub {
  constructor(options = {}) {
    this.options = Object.assign(defaultOptions, options);
  }

  async startServer() {
    const args = Array.prototype.slice.call(arguments);
    const options = Object.assign(this.options, args[0] || {});

    if (options.database) {
      process.env.DATAHUB_DATABASE = options.database;
    } else if (!options.isCli) {
      const projectDirName = process.cwd().split(path.sep).slice(1).join('_');
      const databasePath = path.join(homeDir, '.macaca-datahub', projectDirName);
      mkdir(databasePath);
      process.env.DATAHUB_DATABASE = path.join(databasePath, 'macaca-datahub.data');
      console.log(chalk.cyan(`DataHub storage: ${process.env.DATAHUB_DATABASE}`));
    }

    if (options.enableJavascript) {
      process.env.ENABLE_JAVASCRIPT = 'Y';
    }
    if (options.enableRequestProxy) {
      process.env.ENABLE_REQUEST_PROXY = 'Y';
    }

    if (options.store) {
      process.env.DATAHUB_STORE_PATH = path.resolve(options.store);
    } else {
      await execa(`${require.resolve('sequelize-cli/lib/sequelize')}`, ['db:migrate'], {
        cwd: __dirname,
      });
    }

    if (options.view && options.view.assetsUrl) {
      process.env.DATAHUB_VIEW_CONFIG_ASSETSURL = options.view.assetsUrl;
    }

    process.env.DATAHUB_RPC_PROTOCOL = options.protocol;
    process.env.EGG_SERVER_ENV = options.mode;
    process.env.EGG_MASTER_LOGGER_LEVEL = 'ERROR';

    const socketIoPort = await detectPort(options.socketIoPort);
    process.env.DATAHUB_SOCKET_IO_PORT = socketIoPort;

    const serverPort = await detectPort(options.port);
    const inDocker = process.env.RUN_MODE === 'docker';
    const ip = inDocker ? '127.0.0.1' : ipv4;
    const host = chalk.cyan.underline(`http://${ip}:${serverPort}`);
    console.log(`${EOL}DataHub server start at: ${host}${EOL}`);
    try {
      const proxyMwPkg = require('datahub-proxy-middleware/package');
      if (semver.lt(proxyMwPkg.version, MIN_PROXY_MIDDLEWARE_VERSION)) {
        console.log(
          chalk.red(
            `${EOL}${EOL}datahub-proxy-middleware's version is too low, please upgrade to version: ${MIN_PROXY_MIDDLEWARE_VERSION}${EOL}${EOL}`,
          ),
        );
      }
    } catch (_) {
      // eslint-disable-line
    }
    return new Promise((resolve) => {
      return eggServer.startCluster(
        {
          workers: 1,
          port: serverPort,
          baseDir: __dirname,
        },
        (...args) => {
          resolve(...args);
        },
      );
    });
  }
}

module.exports = DataHub;
