'use strict';

const Subscription = require('egg').Subscription;

class exportArchiveData extends Subscription {

  static get schedule() {
    // export archive data every 5s
    return {
      interval: '2s',
      type: 'worker',
    };
  }

  async subscribe() {
    this.excludeAttributes = this.app.config.exportExcludeAttributes;
    if (!this.app.config.exportArchiveBaseDir) return;
    await this.ctx.service.database.exportData();
  }
}

module.exports = exportArchiveData;
