'use strict';

const Service = require('egg').Service;

class SceneService extends Service {

  async querySceneByInterfaceUniqId({ interfaceUniqId }) {
    return await this.ctx.model.Scene.findAll({
      where: {
        interfaceUniqId,
      },
      order: [
        [
          'createdAt',
          'ASC',
        ],
      ],
    });
  }

  async querySceneByNameAndInterfaceUniqId({ interfaceUniqId, sceneName }) {
    return await this.ctx.model.Scene.findOne({
      where: {
        interfaceUniqId,
        sceneName,
      },
    });
  }

  async querySceneByUniqId({ uniqId }) {
    return await this.ctx.model.Scene.findOne({
      where: {
        uniqId,
      },
    });
  }

  async createScene({ interfaceUniqId, sceneName, data }) {
    return await this.ctx.model.Scene.create({
      interfaceUniqId, sceneName, data,
    });
  }

  async updateScene({ uniqId, payload }) {
    return await this.ctx.model.Scene.update(
      payload,
      {
        where: {
          uniqId,
        },
      }
    );
  }

  async deleteSceneByUniqId({ uniqId }) {
    return await this.ctx.model.Scene.destroy({
      where: {
        uniqId,
      },
    });
  }
}

module.exports = SceneService;
