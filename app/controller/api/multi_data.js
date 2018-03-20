'use strict';

const {
  Controller,
} = require('egg');

class MultlDataController extends Controller {

  async update() {
    const ctx = this.ctx;
    const payload = ctx.request.body;
    if (!Array.isArray(payload)) {
      ctx.fail();
      return;
    }
    const res = await ctx.service.data.updateMultiData(payload);
    if (res) {
      ctx.success(res);
      return;
    }
    ctx.fail();
  }
}

module.exports = MultlDataController;
