'use strict';

const Service = require('egg').Service;
const pathToRegexp = require('path-to-regexp');
const bfj = require('bfj');

class InterfaceService extends Service {

  async queryInterfaceByHTTPContext({ projectUniqId, pathname, method }) {
    const Op = this.ctx.app.Sequelize.Op;
    const res = await this.ctx.model.Interface.findOne({
      where: {
        projectUniqId,
        pathname,
        method: {
          [Op.or]: [ method, 'ALL' ],
        },
      },
    });
    if (!res) {
      return await this.queryInterfaceByHTTPContextAndPathRegexp({
        projectUniqId, pathname, method,
      });
    }
    return res;
  }

  async queryInterfaceByHTTPContextAndPathRegexp({ projectUniqId, pathname, method }) {
    const Op = this.ctx.app.Sequelize.Op;
    const allInterfaceList = await this.ctx.model.Interface.findAll({
      where: {
        projectUniqId,
        method: {
          [Op.or]: [ method, 'ALL' ],
        },
      },
      order: [
        [
          'createdAt',
          'ASC',
        ],
      ],
    });
    for (const interfaceData of allInterfaceList) {
      const re = pathToRegexp(interfaceData.pathname);
      const execResult = re.test(pathname);
      if (execResult) {
        return interfaceData;
      }
    }
    return null;
  }

  async queryInterfaceByProjectUniqId({ projectUniqId }, options = {}) {
    return await this.ctx.model.Interface.findAll({
      ...options,
      where: {
        projectUniqId,
      },
      order: [
        [
          'createdAt',
          'ASC',
        ],
      ],
    });
  }

  async queryInterfaceByUniqId({ uniqId }) {
    return await this.ctx.model.Interface.findOne({
      where: {
        uniqId,
      },
    });
  }

  async createInterface({ projectUniqId, pathname, method, description }) {
    return await this.ctx.model.Interface.create({
      projectUniqId, pathname, method, description,
    });
  }

  async updateInterface({ uniqId, payload }) {
    return await this.ctx.model.Interface.update(
      payload,
      {
        where: {
          uniqId,
        },
      }
    );
  }

  async updateAllProxy({ projectUniqId, enabled }) {
    const interfaces = await this.ctx.model.Interface.findAll({
      where: {
        projectUniqId,
      },
    });

    await Promise.all(interfaces.map(async item => {
      const proxyConfig = Object.assign(item.proxyConfig, {
        enabled,
      });
      return await this.updateInterface({
        uniqId: item.dataValues.uniqId,
        payload: {
          proxyConfig,
        },
      });
    }));

    return null;
  }

  async deleteInterfaceByUniqId({ uniqId }) {
    return await this.ctx.model.Interface.destroy({
      where: {
        uniqId,
      },
    });
  }

  async queryInterfaceAllInfo({ interfaceUniqId }) {
    const scenes = await this.ctx.model.Scene.findAll({
      where: {
        interfaceUniqId,
      },
    });

    const schemas = await this.ctx.service.schema.querySchemaByInterfaceUniqId({
      interfaceUniqId,
    });

    const interfaceData = await this.ctx.service.interface.queryInterfaceByUniqId({
      uniqId: interfaceUniqId,
    });
    const fileName = `interface_${interfaceData.pathname}_${interfaceData.method}.json`;

    return {
      fileName,
      data: {
        pathname: interfaceData.pathname,
        method: interfaceData.method,
        projectUniqId: interfaceData.uniqId,
        description: interfaceData.description,
        contextConfig: interfaceData.contextConfig,
        currentScene: interfaceData.currentScene,
        proxyConfig: interfaceData.proxyConfig,
        scenes,
        schemas,
      },
    };
  }

  async uploadInterfaceByUniqId() {
    const stream = await this.ctx.getFileStream();
    const interfaceData = await bfj.parse(stream);
    const interfaceUniqId = stream.fieldname;

    try {
      const interfaceOldData = await this.queryInterfaceByUniqId({
        uniqId: interfaceUniqId,
      });

      await this.deleteInterfaceByUniqId({
        uniqId: interfaceUniqId,
      });

      const interfaceStatus = await this.ctx.model.Interface.create({
        pathname: interfaceOldData.pathname,
        method: interfaceOldData.method,
        projectUniqId: interfaceOldData.projectUniqId,
        description: interfaceOldData.description,
        contextConfig: interfaceData.contextConfig,
        currentScene: interfaceData.currentScene,
        proxyConfig: interfaceData.proxyConfig,
      });

      for (const scene of interfaceData.scenes) {
        await this.ctx.model.Scene.create({
          interfaceUniqId: interfaceStatus.uniqId,
          sceneName: scene.sceneName,
          data: scene.data,
        });
      }

      for (const schema of interfaceData.schemas) {
        await this.ctx.model.Schema.upsert({
          interfaceUniqId: interfaceStatus.uniqId,
          type: schema.type,
          data: schema.data,
        });
      }
    } catch (err) {
      return err;
    }

    return {
      success: true,
    };
  }
}

module.exports = InterfaceService;
