'use strict';

const _ = require('xutil');

const socket = require('./app/socket');

const chalk = _.chalk;
const detectPort = _.detectPort;

module.exports = app => {
  app.logger.info(`${chalk.cyan('launch datahub at:')} ${app.config.sequelize.storage}`);

  app.beforeStart(async () => {
    const exportArchiveBaseDir = app.config.exportArchiveBaseDir;

    await app.model.sync({
      force: !!exportArchiveBaseDir,
    });

    if (exportArchiveBaseDir) {
      const ctx = app.createAnonymousContext();
      await ctx.service.database.importData();
    }

    const socketPort = await detectPort(app.config.dataHubSocket.port);

    app.config.socket = {
      port: socketPort,
    };

    socket.listen(socketPort);
  });
};

