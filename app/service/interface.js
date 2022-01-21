'use strict';

const {
  Service,
} = require('egg');
const pathToRegexp = require('path-to-regexp');
const _ = require('lodash');

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

  async queryInterfaceDataByProjectUniqId({
    projectUniqId,
  }, options = {}) {

    const { ctx } = this;

    const groups = await ctx.model.Group.findAll({
      ...options,
      where: {
        belongedUniqId: projectUniqId,
        groupType: 'Interface',
      },
      order: [
        [
          'createdAt',
          'ASC',
        ],
      ],
    });

    // Inventory data initialization default grouping
    if (!groups.length) {
      const group = await ctx.model.Group.create({
        groupName: ctx.gettext('defaultGroupName'),
        groupType: 'Interface',
        belongedUniqId: projectUniqId,
      });

      groups.push(group);

      await ctx.model.Interface.update({ groupUniqId: group.uniqId }, {
        where: {
          projectUniqId,
        }
      });
    }

    const interfaces = await ctx.model.Interface.findAll({
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

    const interfaceGroupList = _.chain(interfaces)
    .groupBy("groupUniqId")
    .toPairs()
    .map(currentItem => {
      return _.zipObject(["groupUniqId", "interfaceList"], currentItem);
    })
    .value();

    const interfaceGroupListNew = [];

    groups.forEach(element => {
      const interfaceGroup = interfaceGroupList.find(item => item.groupUniqId === element.uniqId);
      interfaceGroupListNew.push({
        groupName: element.groupName,
        groupUniqId: element.uniqId,
        interfaceList: interfaceGroup ? interfaceGroup.interfaceList : [],
      })
    });

    return {
      interfaceGroupList: interfaceGroupListNew,
      interfaceList: interfaces,
    };
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
    groupUniqId,
    proxyConfig,
  }) {
    const { ctx } = this;

    const interfaceData = await ctx.model.Interface.create({
      projectUniqId,
      pathname,
      method,
      description,
      groupUniqId,
      proxyConfig,
    });

    await ctx.model.Group.create({
      groupName: ctx.gettext('defaultGroupName'),
      groupType: 'Scene',
      belongedUniqId: interfaceData.uniqId,
    });

    return interfaceData;
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
    const { ctx } = this;
    await ctx.model.Group.destroy({
      where: {
        belongedUniqId: uniqId,
        groupType: 'Scene',
      }
    });

    await ctx.model.Scene.destroy({
      where: {
        interfaceUniqId: uniqId,
      }
    });

    return await this.ctx.model.Interface.destroy({
      where: {
        uniqId,
      },
    });
  }

  async duplicateScenes({
    uniqId,
    sceneGroupList
  }) {
    const { ctx } = this;

    await ctx.model.Group.destroy({
      where: {
        belongedUniqId: uniqId,
      },
    });

    for (const sceneGroup of sceneGroupList) {
      const group = await ctx.service.group.createGroup({
        belongedUniqId: uniqId,
        groupName: sceneGroup.groupName,
        groupType: 'Scene',
      });
      for (const scene of sceneGroup.sceneList) {
        await ctx.model.Scene.create({
          interfaceUniqId: uniqId,
          sceneName: scene.sceneName,
          contextConfig: scene.contextConfig,
          data: scene.data,
          groupUniqId: group.uniqId,
        });
      }
    }
    return null;
  }

  async duplicateSchemas({
    uniqId,
    schemas
  }) {
    for (const schema of schemas) {
      await this.ctx.model.Schema.upsert({
        interfaceUniqId: uniqId,
        type: schema.type,
        data: schema.data,
      });
    }
    return null;
  }
}

module.exports = InterfaceService;
