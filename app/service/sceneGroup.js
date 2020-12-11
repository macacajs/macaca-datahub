'use strict';

const {
  Service,
} = require('egg');

class SceneGroupService extends Service {

  async querySceneGroupByProjectUniqId({
    projectUniqId,
  }, options = {}) {
    return await this.ctx.model.SceneGroup.findAll({
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

  async querySceneGroupByUniqId({
    uniqId,
  }) {
    return await this.ctx.model.SceneGroup.findOne({
      where: {
        uniqId,
      },
    });
  }

  async createSceneGroup({
    projectUniqId,
    sceneGroupName,
    description,
  }) {
    return await this.ctx.model.SceneGroup.create({
      projectUniqId,
      sceneGroupName,
      description,
    });
  }

  async updateSceneGroup({
    uniqId,
    payload,
  }) {
    return await this.ctx.model.SceneGroup.update(
      payload,
      {
        where: {
          uniqId,
        },
      }
    );
  }

  async deleteSceneGroupByUniqId({
    uniqId,
  }) {
    return await this.ctx.model.SceneGroup.destroy({
      where: {
        uniqId,
      },
    });
  }
}

module.exports = SceneGroupService;
