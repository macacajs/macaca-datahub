'use strict';

const { Service } = require('egg');
const _ = require('lodash');

class SceneService extends Service {
  async querySceneByInterfaceUniqId({
    interfaceUniqId,
  }, options = {}) {
    return await this.ctx.model.Scene.findAll({
      ...options,
      where: {
        interfaceUniqId,
      },
      order: [
        [
          'updatedAt',
          'ASC',
        ],
      ],
    });
  }

  async querySceneDataByInterfaceUniqId({
    interfaceUniqId,
  }, options = {}) {
    const { ctx } = this;

    const groups = await ctx.model.Group.findAll({
      ...options,
      where: {
        belongedUniqId: interfaceUniqId,
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
        groupType: 'Scene',
        belongedUniqId: interfaceUniqId,
      });

      groups.push(group);

      await ctx.model.Scene.update({ groupUniqId: group.uniqId }, {
        where: {
          interfaceUniqId,
        }
      });
    }

    const scenes = await ctx.model.Scene.findAll({
      ...options,
      where: {
        interfaceUniqId,
      },
      order: [
        [
          'updatedAt',
          'ASC',
        ],
      ],
    });

    const sceneGroupList = _.chain(scenes)
    .groupBy("groupUniqId")
    .toPairs()
    .map(currentItem => {
      return _.zipObject(["groupUniqId", "sceneList"], currentItem);
    })
    .value();

    const sceneGroupListNew = [];

    groups.forEach(element => {
      const sceneGroup = sceneGroupList.find(item => item.groupUniqId === element.uniqId);
      sceneGroupListNew.push({
        groupName: element.groupName,
        groupUniqId: element.uniqId,
        sceneList: sceneGroup ? sceneGroup.sceneList : [],
      })
    });

    return {
      sceneGroupList: sceneGroupListNew,
      sceneList: scenes,
    };
  }

  async querySceneByInterfaceUniqIdAndSceneName({
    interfaceUniqId,
    sceneName,
  }, options = {}) {
    return await this.ctx.model.Scene.findOne({
      ...options,
      where: {
        interfaceUniqId,
        sceneName,
      },
    });
  }

  async querySceneByUniqId({
    uniqId,
  }) {
    return await this.ctx.model.Scene.findOne({
      where: {
        uniqId,
      },
    });
  }

  async createScene({
    interfaceUniqId,
    sceneName,
    groupUniqId,
    contextConfig,
    data,
    format,
  }) {
    return await this.ctx.model.Scene.create({
      interfaceUniqId,
      sceneName,
      groupUniqId,
      contextConfig,
      data,
      format,
    });
  }

  async updateScene({
    uniqId,
    payload,
  }) {
    return await this.ctx.model.Scene.update(
      payload,
      {
        where: {
          uniqId,
        },
      }
    );
  }

  async deleteSceneByUniqId({
    uniqId,
  }) {
    return await this.ctx.model.Scene.destroy({
      where: {
        uniqId,
      },
    });
  }
}

module.exports = SceneService;
