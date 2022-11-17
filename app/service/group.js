'use strict';

const { Service } = require('egg');

class GroupService extends Service {
  async queryGroupByBelongedUniqId({
    belongedUniqId,
    groupType,
  }, options = {}) {
    return await this.ctx.model.Group.findAll({
      ...options,
      where: {
        belongedUniqId,
        groupType,
      },
      order: [
        [
          'createdAt',
          'ASC',
        ],
      ],
    });
  }

  async createGroup({
    belongedUniqId,
    groupName,
    groupType,
  }) {
    return await this.ctx.model.Group.create({
      belongedUniqId,
      groupName,
      groupType,
    });
  }

  async updateGroupName({
    uniqId,
    groupName,
  }) {
    return await this.ctx.model.Group.update(
      { groupName },
      {
        where: {
          uniqId,
        },
      }
    );
  }

  async deleteGroupByUniqId({
    uniqId,
  }) {
    return await this.ctx.model.Group.destroy({
      where: {
        uniqId,
      },
    });
  }
}

module.exports = GroupService;
