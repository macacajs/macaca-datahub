'use strict';

const fs = require('fs');
const _ = require('xutil');
const path = require('path');

const socket = require('./app/socket');

const chalk = _.chalk;
const detectPort = _.detectPort;

module.exports = app => {
  app.logger.info(`${chalk.cyan('launch datahub at:')} ${app.config.sequelize.database}`);

  app.beforeStart(async () => {
    await app.model.sync();

    if (app.config.dataHubStoreDir) {
      app.logger.info(`${chalk.cyan('launch datahub store at:')} ${app.config.dataHubStoreDir}`);

      const ctx = app.createAnonymousContext();

      const hubFile = path.resolve(app.config.dataHubStoreDir, 'hub.data');

      if (_.isExistedFile(hubFile)) {

        app.logger.info(`${chalk.cyan('import datahub from:')} ${hubFile}`);

        const content = fs.readFileSync(hubFile, 'utf8');

        try {
          const list = JSON.parse(content);

          for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const {
              identifer,
            } = data;
            await ctx.model.Project.upsert({
              ...data,
            }, {
              where: {
                identifer,
              },
            });
          }
        } catch (e) {
          app.logger.warn(e.message);
        }
      }

      const archiveFile = path.resolve(app.config.dataHubStoreDir, 'archive.data');

      if (_.isExistedFile(archiveFile)) {

        app.logger.info(`${chalk.cyan('import datahub from:')} ${archiveFile}`);
        const content = fs.readFileSync(archiveFile, 'utf8');

        try {
          const list = JSON.parse(content);

          const tables = Object.keys(_.groupBy(list, 'identifer'));

          for (let i = 0; i < tables.length; i++) {
            await ctx.model.Data.destroy({
              where: {
                identifer: tables[i],
              },
            });
          }

          for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const {
              identifer,
              pathname,
            } = data;
            await ctx.model.Data.upsert({
              ...data,
            }, {
              where: {
                identifer,
                pathname,
              },
            });
          }
        } catch (e) {
          app.logger.warn(e.message);
        }
      }
    }

    const socketPort = await detectPort(app.config.dataHubSocket.port);

    app.config.socket = {
      port: socketPort,
    };

    socket.listen(socketPort);
  });
};

