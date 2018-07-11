'use strict';

const {
  Service,
} = require('egg');
const _ = require('xutil');
const fs = require('mz/fs');
const path = require('path');
const pathToRegexp = require('path-to-regexp');

const PROXY_CONTENT_KEYS = [
  'statusCode',
  'responseHeaders',
];


class DataService extends Service {

  async queryByProjectId(projectId) {
    return await this.ctx.model.Data.findAll({
      where: {
        identifer: projectId,
      },
      raw: true,
    });
  }

  async getByProjectIdAndDataId(projectId, dataId) {
    let res = await this.ctx.model.Data.findOne({
      where: {
        identifer: projectId,
        pathname: dataId,
      },
      raw: true,
    });
    if (!res) {
      res = await this.ctx.service.data.getByProjectIdAndPathRegexp(projectId, dataId);
    }
    return res;
  }

  async getByProjectIdAndPathRegexp(projectId, dataId) {
    const data = await this.ctx.model.Data.findAll({
      where: {
        identifer: projectId,
      },
      raw: true,
    });
    for (const record of data) {
      const keys = [];
      const re = pathToRegexp(record.pathname, keys);
      const execResult = re.exec(dataId);
      if (execResult) {
        record.__pathParam = this._getPathParam(keys, execResult);
        return record;
      }
    }
    return null;
  }

  _getPathParam(keys, execResult) {
    const param = {};
    keys.forEach((value, index) => {
      param[value.name] = execResult[index + 1];
    });
    return param;
  }

  async addByProjectId(projectId, data) {
    await this.ctx.model.Data.create({
      identifer: projectId,
      pathname: data.pathname,
      description: data.description,
    });
    return await this.asyncMigration();
  }

  async updateByProjectIdAndDataId(projectId, dataId, data) {
    await this.ctx.model.Data.update({
      ...data,
    }, {
      where: {
        identifer: projectId,
        pathname: dataId,
      },
    });
    return await this.asyncMigration();
  }

  async getSchemaData(projectId, dataId) {
    const data = await this.getByProjectIdAndDataId(projectId, dataId);
    if (!data) {
      return {};
    }
    return {
      reqSchemaContent: data.reqSchemaContent,
      resSchemaContent: data.resSchemaContent,
    };
  }

  async updateMultiData(payload = []) {
    const ctx = this.ctx;
    await Promise.all(payload.map(item => {
      const { projectId, dataId, ...data } = item;
      return (async () => {
        const currentValue = await ctx.service.data.getByProjectIdAndDataId(projectId, dataId);

        // build proxyContent data begin
        let proxyContent = {};
        try {
          proxyContent = JSON.parse(currentValue.proxyContent);
        } catch (_) { /* reset if invalid */ }
        for (const key of PROXY_CONTENT_KEYS) {
          if (typeof data[key] !== 'undefined') {
            proxyContent[key] = data[key];
            delete data[key];
          }
        }
        data.proxyContent = JSON.stringify(proxyContent);
        await ctx.model.Data.update({
          ...data,
        }, {
          where: {
            identifer: projectId,
            pathname: dataId,
          },
        });
      })();
    }));
    return await this.asyncMigration();
  }

  async removeByProjectId(projectId) {
    await this.ctx.model.Data.destroy({
      where: {
        identifer: projectId,
      },
    });
    return await this.asyncMigration();
  }

  async removeByProjectIdAndDataId(projectId, dataId) {
    await this.ctx.model.Data.destroy({
      where: {
        identifer: projectId,
        pathname: dataId,
      },
    });
    return await this.asyncMigration();
  }

  async asyncMigration() {
    const res = await this.ctx.model.Data.findAll({
      where: {
        [this.app.Sequelize.Op.or]: this.ctx.app.whiteList || [],
      },
      raw: true,
    });

    if (this.ctx.app.config.dataHubStoreDir) {
      _.mkdir(this.ctx.app.config.dataHubStoreDir);
      const distRes = res.map(item => {
        delete item.id;
        delete item.created_at;
        delete item.updated_at;
        return item;
      });

      const archivePath = path.resolve(this.ctx.app.config.dataHubStoreDir, 'archive.data');
      try {
        await fs.writeFile(archivePath, JSON.stringify(distRes, null, 2));
        this.ctx.logger.info('archive.data saved');
      } catch (err) {
        this.ctx.logger.error('can\'t save archive.data', err);
      }
    }
    return res;
  }
}

module.exports = DataService;
