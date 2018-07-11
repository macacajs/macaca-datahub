'use strict';

const Controller = require('egg').Controller;

class SceneController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const res = await ctx.service.scene.querySceneByInterfaceUniqId();
    ctx.body = res;
  }

  async show() {
    const ctx = this.ctx;
    const res = await ctx.service.scene.querySceneByUniqId();
    ctx.body = res;
  }

  async create() {
    const ctx = this.ctx;
    const res = await ctx.service.scene.createScene();
    ctx.body = res;
  }

  async update() {
    const ctx = this.ctx;
    const res = await ctx.service.scene.updateScene();
    ctx.body = res;
  }

  async delete() {
    const ctx = this.ctx;
    const res = await ctx.service.scene.deleteSceneByUniqId();
    ctx.body = res;
  }
}

module.exports = SceneController;
