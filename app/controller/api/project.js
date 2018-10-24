'use strict';

const bfj = require('bfj');
const Controller = require('egg').Controller;

class ProjectController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const _res = await ctx.service.project.queryAllProject();
    const res = [];
    for (const _item of _res) {
      const item = _item.get({ plain: true });
      const iterfaceList = await ctx.service.interface.queryInterfaceByProjectUniqId({
        projectUniqId: item.uniqId,
      });
      const allSceneList = await Promise.all(iterfaceList.map(({ uniqId: interfaceUniqId }) => {
        return ctx.service.scene.querySceneByInterfaceUniqId({ interfaceUniqId });
      }));
      let bufSize = 0;
      for (const sceneList of allSceneList) {
        for (const scene of sceneList) {
          const buf = new Buffer(JSON.stringify(scene.data));
          bufSize += buf.length;
        }
      }
      const readableSize = bufSize >= 1024 ?
        `${(bufSize / 1024).toFixed(2)}KB` :
        `${bufSize}B`;

      item.capacity = {
        count: iterfaceList.length,
        size: readableSize,
      };
      res.push(item);
    }
    ctx.success(res);
  }

  async show() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.project.queryProjectByUniqId({ uniqId });
    ctx.success(res);
  }

  async create() {
    const ctx = this.ctx;
    const {
      projectName,
      description,
    } = ctx.request.body;
    ctx.assertParam({ projectName, description });
    const res = await ctx.service.project.createProject({
      projectName,
      description,
    });
    ctx.success(res);
  }

  async update() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const payload = {};
    [ 'description', 'projectName' ].forEach(i => {
      if (ctx.request.body[i]) payload[i] = ctx.request.body[i];
    });
    const res = await ctx.service.project.updateProject({
      uniqId,
      payload,
    });
    ctx.success(res);
  }

  async delete() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.project.deleteProjectByUniqId({ uniqId });
    ctx.success(res);
  }

  async download() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.transfer.downloadProject({ uniqId });

    ctx.body = JSON.stringify(res.data, null, 2);
    ctx.attachment(res.fileName);
  }

  async upload() {
    const ctx = this.ctx;
    const stream = await this.ctx.getFileStream();
    const projectData = await bfj.parse(stream);
    const projectUniqId = stream.fieldname;

    const res = await ctx.service.transfer.uploadProject({
      projectData,
      projectUniqId,
    });
    ctx.body = res;
  }
}

module.exports = ProjectController;
