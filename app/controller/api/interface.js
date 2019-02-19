'use strict';

const {
  Controller,
} = require('egg');
const getStream = require('get-stream');

class InterfaceController extends Controller {

  async showAll() {
    const ctx = this.ctx;
    const { projectUniqId } = ctx.query;
    ctx.assertParam({ projectUniqId });
    const res = await ctx.service.interface.queryInterfaceByProjectUniqId({ projectUniqId });
    ctx.success(res);
  }

  async show() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.interface.queryInterfaceByUniqId({ uniqId });
    ctx.success(res);
  }

  async create() {
    const ctx = this.ctx;
    const { projectUniqId, pathname, method, description } = ctx.request.body;
    ctx.assertParam({ projectUniqId, pathname, method, description });
    const res = await ctx.service.interface.createInterface({
      projectUniqId, pathname, method: method.toUpperCase(), description,
    });
    ctx.success(res);
  }

  async update() {
    const ctx = this.ctx;
    const uniqId = ctx.params.uniqId;
    const payload = {};
    [
      'pathname',
      'method',
      'description',
      'currentScene',
      'proxyConfig',
    ].forEach(i => {
      if (ctx.request.body[i]) {
        payload[i] = ctx.request.body[i];
      }
    });
    const proxyConfig = payload.proxyConfig;

    if (proxyConfig) {
      const activeIndex = proxyConfig.activeIndex || 0;
      const proxyList = proxyConfig.proxyList || [];
      if (activeIndex && activeIndex >= proxyList.length) {
        proxyConfig.activeIndex = proxyList.length - 1;
      }
    }
    const res = await ctx.service.interface.updateInterface({
      uniqId,
      payload,
    });
    ctx.success(res);
  }

  async delete() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.interface.deleteInterfaceByUniqId({ uniqId });
    if (res) {
      ctx.success(res);
      return;
    }
    ctx.fail(ctx.gettext('common.delete.fail'));
  }

  async download() {
    const ctx = this.ctx;
    const {
      interfaceUniqId,
    } = ctx.query;
    const res = await ctx.service.transfer.downloadInterface({
      interfaceUniqId,
    });

    ctx.body = JSON.stringify(res.data, null, 2);
    ctx.attachment(res.fileName);
  }

  async upload() {
    const ctx = this.ctx;
    const stream = await this.ctx.getFileStream();
    const interfaceString = await getStream(stream);
    const interfaceData = JSON.parse(interfaceString);
    const interfaceUniqId = stream.fieldname;

    const res = await ctx.service.transfer.uploadInterface({
      interfaceData,
      interfaceUniqId,
    });
    ctx.body = res;
  }
}

module.exports = InterfaceController;
