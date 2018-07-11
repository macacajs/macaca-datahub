'use strict';

const _ = require('xutil');

const socket = require('./app/socket');

const chalk = _.chalk;
const detectPort = _.detectPort;

module.exports = app => {
  app.logger.info(`${chalk.cyan('launch datahub at:')} ${app.config.sequelize.storage}`);

  app.beforeStart(async () => {
    await app.model.sync({
      force: true,
    });

    const socketPort = await detectPort(app.config.dataHubSocket.port);

    app.config.socket = {
      port: socketPort,
    };

    socket.listen(socketPort);
  });
};

