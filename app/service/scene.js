'use strict';

const Service = require('egg').Service;

class SceneService extends Service {

  async querySceneByProjectUniqId() {
    return await this.ctx.model.Scene.findAll();
  }

  async queryScene() {
    return await this.ctx.model.Scene.findAll();
  }

  async querySceneByUniqId() {
    return await this.ctx.model.Scene.findAll();
  }

  async createScene() {
    return await this.ctx.model.Scene.findAll();
  }

  async updateScene() {
    return await this.ctx.model.Scene.findAll();
  }

  async deleteSceneByUniqId() {
    return await this.ctx.model.Scene.findAll();
  }
}

module.exports = SceneService;

