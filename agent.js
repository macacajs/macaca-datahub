'use strict';

const { chalk } = require('xutil');
const socket = require('./app/socket');

module.exports = agent => {
  if (agent.config.sequelize.storage) {
    agent.logger.info(`${chalk.cyan('launch datahub at:')} ${agent.config.sequelize.storage}`);
  }

  agent.beforeStart(async () => {
    socket.listen(agent.config.dataHubSocket.port);
    const exportArchiveBaseDir = agent.config.exportArchiveBaseDir;
    if (exportArchiveBaseDir) {
      await agent.model.sync({ force: true });
    }
  });

  agent.messenger.once('egg-ready', () => {
    const exportArchiveBaseDir = agent.config.exportArchiveBaseDir;
    if (exportArchiveBaseDir) {
      agent.messenger.sendRandom('worker_import_data', exportArchiveBaseDir);
    }
  });

  agent.messenger.on('emit_socket_data', data => {
    socket.emit(data);
  });
};

