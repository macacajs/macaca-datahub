'use strict';

const {
  Controller,
} = require('egg');

class SceneGroupController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const { projectUniqId } = ctx.query;
    ctx.assertParam({ projectUniqId });
    const res = await ctx.service.sceneGroup.querySceneGroupByProjectUniqId({ projectUniqId });
    ctx.success(res);
  }

  async show() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.sceneGroup.querySceneGroupByUniqId({ uniqId });
    ctx.success(res);
  }

  async create() {
    const ctx = this.ctx;
    const { projectUniqId, sceneGroupName, description } = ctx.request.body;
    ctx.assertParam({ projectUniqId, sceneGroupName });
    const res = await ctx.service.sceneGroup.createSceneGroup({
      projectUniqId, sceneGroupName, description,
    });
    ctx.success(res);
  }

  async update() {
    const ctx = this.ctx;
    const uniqId = ctx.params.uniqId;
    const payload = {};
    [
      'sceneGroupName',
      'description',
      'enable',
      'interfaceList',
    ].forEach(i => {
      if (ctx.request.body[i] !== undefined) {
        payload[i] = ctx.request.body[i];
      }
    });
    const res = await ctx.service.sceneGroup.updateSceneGroup({
      uniqId,
      payload,
    });
    ctx.success(res);
  }

  async delete() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.sceneGroup.deleteSceneGroupByUniqId({ uniqId });
    if (res) {
      ctx.success(res);
      return;
    }
    ctx.fail(ctx.gettext('common.delete.fail'));
  }
}

module.exports = SceneGroupController;
