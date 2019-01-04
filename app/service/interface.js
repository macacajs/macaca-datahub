'use strict';

const {
  Service,
} = require('egg');
const pathToRegexp = require('path-to-regexp');

class InterfaceService extends Service {

  async queryInterfaceByHTTPContext({
    projectUniqId,
    pathname,
    method,
    tagName,
  }) {
    const Op = this.ctx.app.Sequelize.Op;
    let res = await this.ctx.model.Interface.findOne({
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
      res = await this.queryInterfaceByHTTPContextAndPathRegexp({
        projectUniqId,
        pathname,
        method,
      });
    }
    if (tagName) {
      const originInterfaceId = res.uniqId;
      const shadowRes = await this.queryShadowInterfaceById({
        originInterfaceId,
        tagName,
      });

      if (shadowRes) {
        return shadowRes;
      }
    }
    return res;
  }

  async queryShadowInterfaceById({
    originInterfaceId,
    tagName,
  }) {
    return await this.ctx.model.ShadowInterface.findOne({
      where: {
        originInterfaceId,
        tagName,
      },
    });
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
    proxyConfig,
  }) {
    return await this.ctx.model.Interface.create({
      projectUniqId,
      pathname,
      method,
      description,
      proxyConfig,
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

  async updateShadowInterface({
    originInterfaceId,
    tagName,
    payload,
  }) {
    const res = await this.ctx.model.ShadowInterface.findOne({
      where: {
        originInterfaceId,
        tagName,
      },
    });
    if (res) {
      return await this.ctx.model.ShadowInterface.update(
        payload,
        {
          where: {
            originInterfaceId,
            tagName,
          },
        }
      );
    }
    return await this.ctx.model.ShadowInterface.create({
      originInterfaceId,
      tagName,
      payload,
    });
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
