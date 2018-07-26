'use strict';

const rimraf = require('rimraf');
const Subscription = require('egg').Subscription;

class exportArchiveData extends Subscription {

  static get schedule() {
    // export archive data every 4s
    return {
      interval: '4s',
      type: 'worker',
    };
  }

  async subscribe() {
    // disabled in test NODE_ENV
    if ([ 'test' ].includes(process.env.NODE_ENV)) return;
    this.excludeAttributes = this.app.config.exportExcludeAttributes;
    if (!this.app.config.exportArchiveBaseDir) return;
    if (this.app.EXPORT_LOCKING === true) return;
    try {
      this.app.EXPORT_LOCKING = true;
      rimraf.sync(this.app.config.exportArchiveBaseDir);
      await this.ctx.service.database.exportData();
    } catch (_) { /* ignore */ }
    this.app.EXPORT_LOCKING = false;
  }
}

module.exports = exportArchiveData;
