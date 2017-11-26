'use strict';

const _ = require('xutil');
const Controller = require('egg').Controller;

class DataController extends Controller {

  async index(ctx) {
    const projectId = ctx.params.projectId;
    const dataId = ctx.params.dataId;

    const res = await this.ctx.service.data.getByProjectIdAndDataId(projectId, dataId);

    const {
      scenes,
      currentScene,
    } = res;

    try {
      const json = JSON.parse(scenes);
      const list = _.filter(json, e => e.name === currentScene);
      this.ctx.body = list[0].data;
    } catch (e) {
      this.ctx.body = {};
    }
  }

  async query(ctx) {
    const projectId = ctx.params.projectId;
    const res = await this.ctx.service.data.queryByProjectId(projectId);
    if (res) {
      this.ctx.body = {
        success: true,
        data: res,
      };
    } else {
      this.ctx.body = {
        success: false,
      };
    }
  }

  async add(ctx) {
    const projectId = ctx.params.projectId;
    const body = ctx.request.body;

    const res = await this.ctx.service.data.addByProjectId(projectId, body);

    if (res) {
      this.ctx.body = {
        success: true,
        data: res,
      };
    } else {
      this.ctx.body = {
        success: false,
      };
    }
  }

  async update(ctx) {
    const projectId = ctx.params.projectId;
    const dataId = ctx.params.dataId;
    const body = ctx.request.body;

    const res = await this.ctx.service.data.updateByProjectIdAndDataId(projectId, dataId, body);

    if (res) {
      this.ctx.body = {
        success: true,
        data: res,
      };
    } else {
      this.ctx.body = {
        success: false,
      };
    }
  }

  async remove(ctx) {
    const projectId = ctx.params.projectId;
    const dataId = ctx.params.dataId;
    const res = await ctx.service.data.removeByProjectIdAndDataId(projectId, dataId);
    if (res) {
      this.ctx.body = {
        success: true,
      };
    } else {
      this.ctx.body = {
        success: false,
      };
    }
  }
}

module.exports = DataController;

