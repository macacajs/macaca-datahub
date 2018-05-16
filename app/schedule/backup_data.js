'use strict';

const fs = require('mz/fs');
const path = require('path');
const Subscription = require('egg').Subscription;
const BACKUP_FILE_INFIX = '-backup-';
const BACKUP_LIMIT_NUMBER = 7;

class BackupData extends Subscription {

  static get schedule() {
    // 启动时执行一次，每天 0 时执行一次
    return {
      cron: '* * 0 * * *',
      type: 'worker',
      immediate: true,
    };
  }

  async subscribe() {
    await this.removeOutdatedFiles();
    const storeFile = this.ctx.app.config.sequelize.storage;
    const backUpFile = `${storeFile}${BACKUP_FILE_INFIX}${(new Date()).toISOString()}`;
    try {
      await fs.copyFile(storeFile, backUpFile);
      this.ctx.app.logger.info(`backup successfully: ${backUpFile}`);
    } catch (e) {
      this.ctx.app.logger.info(`backup failed: ${e}`);
    }
  }

  async removeOutdatedFiles() {
    const backupDir = path.dirname(this.ctx.app.config.sequelize.storage);
    const fileList = await fs.readdir(backupDir);
    const prefix = `${path.basename(this.ctx.app.config.sequelize.storage)}${BACKUP_FILE_INFIX}`;
    const backupFileList = fileList
      .filter(name => name.startsWith(prefix)).sort().reverse();
    const outDatedFiles = backupFileList.slice(BACKUP_LIMIT_NUMBER - 1);
    this.ctx.app.logger.info(`will remove outdated backup files ${outDatedFiles}`);
    await Promise.all(outDatedFiles.map(async file => {
      await fs.unlink(path.join(backupDir, file));
    }));

  }
}

module.exports = BackupData;
