'use strict';

const {
  ipv4,
  chalk,
  detectPort,
  mkdir,
} = require('xutil');
const path = require('path');
const EOL = require('os').EOL;
const execa = require('execa');
const eggServer = require('egg');

const defaultOptions = {
  port: 9200,
  mode: 'unittest',
  protocol: 'http',
  socketIoPort: 9300,
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
      const projectDirName = process.cwd()
        .split(path.sep)
        .slice(1)
        .join('_');
      const databasePath = path.join(process.env.HOME, '.macaca-datahub', projectDirName);
      mkdir(databasePath);
      process.env.DATAHUB_DATABASE = path.join(databasePath, 'macaca-datahub.data');
      console.log(chalk.cyan(`DataHub storage: ${process.env.DATAHUB_DATABASE}`));
    }

    if (options.store) {
      process.env.DATAHUB_STORE_PATH = path.resolve(options.store);
    } else {
      await execa(`${require.resolve('sequelize-cli/lib/sequelize')}`, [ 'db:migrate' ], {
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
    const host = chalk.cyan.underline(`http://${ip}:${(serverPort)}`);
    console.log(`${EOL}DataHub server start at: ${host}${EOL}`);
    return eggServer.startCluster({
      workers: 1,
      port: serverPort,
      baseDir: __dirname,
    });
  }
}

module.exports = DataHub;
