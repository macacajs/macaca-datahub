'use strict';

const { chalk } = require('xutil');

module.exports = app => {
  app.messenger.on('worker_import_data', exportArchiveBaseDir => {
    const ctx = app.createAnonymousContext();
    ctx.runInBackground(async () => {
      app.logger.info(`${chalk.cyan('import datahub from:')} ${exportArchiveBaseDir}`);
      await ctx.service.database.importData();
    });
  });
};

