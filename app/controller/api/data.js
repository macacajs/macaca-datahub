'use strict';

const _ = require('xutil');
const Controller = require('egg').Controller;

const socket = require('../../socket');

class DataController extends Controller {

  async index(ctx) {
    const projectId = ctx.params.projectId;
    const dataId = ctx.params.dataId;

    const res = await this.ctx.service.data.getByProjectIdAndDataId(projectId, dataId);

    const {
      scenes,
      currentScene,
      proxyContent,
    } = res;

    const date = _.moment().format('YY-MM-DD HH:mm:ss');
    let proxyOrigin = {};
    try {
      proxyOrigin = JSON.parse(proxyContent);
    } catch (e) {
      ctx.logger.error('[proxy error]', e);
    }

    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Access-Control-Allow-Origin', ctx.get('origin'));

    if (proxyOrigin.useProxy) {
      try {
        const index = proxyOrigin.originKeys.indexOf(proxyOrigin.currentProxyIndex);
        const _res = await ctx.curl(proxyOrigin.proxies[index], {
          method: ctx.method,
          headers: ctx.header,
          timeout: 3000,
          data: ctx.request.body,
          dataType: 'json',
        });
        ctx.body = _res.data;
      } catch (e) {
        ctx.logger.error('[proxy error]', e);
        ctx.body = {};
      }

      socket.emit({
        type: 'http',
        date,
        req: {
          method: ctx.method,
          path: ctx.path.replace(/^\/data/g, ''),
          headers: ctx.header,
        },
        res: {
          status: 200,
          host: ctx.host,
          body: ctx.body,
        },
      });
    } else {

      try {
        const json = JSON.parse(scenes);
        const list = _.filter(json, e => e.name === currentScene);
        const data = list[0].data;
        ctx.body = data;
      } catch (e) {
        ctx.body = {};
      }

      socket.emit({
        type: 'http',
        date,
        req: {
          method: ctx.method,
          path: ctx.path.replace(/^\/data/g, ''),
          headers: ctx.header,
        },
        res: {
          status: 200,
          host: ctx.host,
          body: ctx.body,
        },
      });
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

