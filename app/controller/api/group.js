'use strict';

const { Controller } = require('egg');

class GroupController extends Controller {

  async create() {
    const ctx = this.ctx;
    const { belongedUniqId, groupName, groupType } = ctx.request.body;
    ctx.assertParam({ belongedUniqId, groupName, groupType });
    const res = await ctx.service.group.createGroup({
      belongedUniqId,
      groupName,
      groupType,
    });
    ctx.success(res);
  }

  async update() {
    const ctx = this.ctx;
    const uniqId = ctx.params.uniqId;
    const { groupName } = ctx.request.body;
    const res = await ctx.service.group.updateGroupName({
      uniqId,
      groupName,
    });
    ctx.success(res);
  }

  async delete() {
    const ctx = this.ctx;
    const { uniqId } = ctx.params;
    const res = await ctx.service.group.deleteGroupByUniqId({ uniqId });
    if (res) {
      ctx.success(res);
      return;
    }
    ctx.fail(ctx.gettext('common.delete.fail'));
  }

  async showAll() {
    const ctx = this.ctx;
    const { belongedUniqId, groupType } = ctx.query;
    ctx.assertParam({ belongedUniqId, groupType });
    const res = await ctx.service.group.queryGroupByBelongedUniqId({ belongedUniqId, groupType });
    ctx.success(res);
  } 
}

module.exports = GroupController;
