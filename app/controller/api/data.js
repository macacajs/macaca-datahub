'use strict';

const _ = require('xutil');
const Controller = require('egg').Controller;

const socket = require('../../socket');

const allowedProxyHeaders = [
  'set-cookie',
  'content-type',
];

class DataController extends Controller {

  async index() {
    const ctx = this.ctx;
    const projectId = ctx.params.projectId;
    const dataId = ctx.params.dataId;

    const res = await this.ctx.service.data.getByProjectIdAndDataId(projectId, dataId);

    const {
      scenes,
      currentScene,
      proxyContent,
      delay,
    } = res;

    if (delay) {
      ctx[Symbol.for('context#delay')] = delay;
    }

    const date = _.moment().format('YY-MM-DD HH:mm:ss');
    let proxyOrigin = {};
    try {
      proxyOrigin = JSON.parse(proxyContent);
    } catch (e) {
      ctx.logger.error('[proxy error]', e);
    }

    if (proxyOrigin.useProxy) {
      ctx.set('x-datahub-proxy', 'true');
      let proxyResponse = {};
      let proxyResponseStatus = 200;
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
        proxyResponse = _res.res;
        proxyResponseStatus = _res.status;
        for (const key of allowedProxyHeaders) {
          _res.headers[key] && ctx.set(key, _res.headers[key]);
        }
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
          status: proxyResponseStatus,
          host: ctx.host,
          body: ctx.body,
        },
        proxyResponse,
      });
    } else {

      let statusCode = 200;
      if (proxyOrigin.statusCode) {
        statusCode = parseInt(proxyOrigin.statusCode, 10);
        ctx[Symbol.for('context#status')] = statusCode;
      }

      try {
        const json = JSON.parse(scenes);
        const list = _.filter(json, e => e.name === currentScene);
        const data = list[0].data;
        if (statusCode === 200) {
          ctx.body = data;
        } else {
          ctx.body = `Response status: ${statusCode}`;
        }
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
          status: statusCode,
          host: ctx.host,
          body: ctx.body,
        },
      });
    }

  }

  async queryByProjectId() {
    const ctx = this.ctx;
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

  async queryByProjectIdAndDataId() {
    const ctx = this.ctx;
    const { projectId, dataId } = ctx.params;
    const res = await this.ctx.service.data.getByProjectIdAndDataId(projectId, dataId);
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

  async add() {
    const ctx = this.ctx;
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

  async update() {
    const ctx = this.ctx;
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

  async remove() {
    const ctx = this.ctx;
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
