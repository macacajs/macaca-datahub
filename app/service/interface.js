'use strict';

const {
  Service,
} = require('egg');
const pathToRegexp = require('path-to-regexp');

const cacheStore = new Map();

class InterfaceService extends Service {

  async queryInterfaceByHTTPContext({
    projectUniqId,
    pathname,
    method,
  }) {
    const Op = this.ctx.app.Sequelize.Op;
    const res = await this.ctx.model.Interface.findOne({
      where: {
        projectUniqId,
        pathname,
        method: {
          [Op.or]: [
            method,
            'ALL',
          ],
        },
      },
    });
    if (!res) {
      return await this.queryInterfaceByHTTPContextAndPathRegexp({
        projectUniqId,
        pathname,
        method,
      });
    }
    return res;
  }

  async queryInterfaceByHTTPContextFromCache({
    projectUniqId,
    pathname,
    method,
    tagName,
  }) {
    const cacheKey = `${tagName}#${projectUniqId}`;

    if (!cacheStore.get(cacheKey)) {
      const res = await this.queryInterfaceByHTTPContext({
        projectUniqId,
        pathname,
        method,
      });
      cacheStore.set(cacheKey, res);
    }

    return cacheStore.get(cacheKey);
  }

  async queryInterfaceByHTTPContextAndPathRegexp({
    projectUniqId,
    pathname,
    method,
  }) {
    const Op = this.ctx.app.Sequelize.Op;
    const allInterfaceList = await this.ctx.model.Interface.findAll({
      where: {
        projectUniqId,
        method: {
          [Op.or]: [
            method,
            'ALL',
          ],
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

  async queryInterfaceByProjectUniqId({
    projectUniqId,
  }, options = {}) {
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

  async queryInterfaceByUniqId({
    uniqId,
  }) {
    return await this.ctx.model.Interface.findOne({
      where: {
        uniqId,
      },
    });
  }

  async createInterface({
    projectUniqId,
    pathname,
    method,
    description,
  }) {
    return await this.ctx.model.Interface.create({
      projectUniqId,
      pathname,
      method,
      description,
    });
  }

  async updateInterface({
    uniqId,
    payload,
  }) {
    return await this.ctx.model.Interface.update(
      payload,
      {
        where: {
          uniqId,
        },
      }
    );
  }

  async updateInterfaceFromCache({
    uniqId,
    payload,
    tagName,
  }) {
    const cacheKey = `${tagName}#${uniqId}`;

    let data = cacheStore.get(cacheKey);
    if (!data) {
      const currentInterface = await this.queryInterfaceByUniqId({
        uniqId
      });
      const { projectUniqId, pathname, method } = currentInterface;
      data = await this.queryInterfaceByHTTPContext({
        projectUniqId,
        pathname,
        method,
      });
      cacheStore.set(cacheKey, data);
    }
    cacheStore.set(cacheKey, Object.assign(data, payload));
  }

  async updateAllProxy({
    projectUniqId,
    enabled,
  }) {
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

  async deleteInterfaceByUniqId({
    uniqId,
  }) {
    return await this.ctx.model.Interface.destroy({
      where: {
        uniqId,
      },
    });
  }
}

module.exports = InterfaceService;
