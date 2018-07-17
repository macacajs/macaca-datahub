'use strict';

const Service = require('egg').Service;

class InterfaceService extends Service {

  async queryInterfaceByProjectUniqId({ projectUniqId }) {
    return await this.ctx.model.Interface.findAll({
      where: {
        projectUniqId,
      },
      order: [
        [
          'createdAt',
          'ASC',
        ],
      ],
    });
  }

  async queryInterfaceByUniqId({ uniqId }) {
    return await this.ctx.model.Interface.findOne({
      where: {
        uniqId,
      },
    });
  }

  async createInterface({ projectUniqId, pathname, method, description }) {
    return await this.ctx.model.Interface.create({
      projectUniqId, pathname, method, description,
    });
  }

  async updateInterface({ uniqId, payload }) {
    return await this.ctx.model.Interface.update(
      payload,
      {
        where: {
          uniqId,
        },
      }
    );
  }

  async deleteInterfaceByUniqId({ uniqId }) {
    return await this.ctx.model.Interface.destroy({
      where: {
        uniqId,
      },
    });
  }
}

module.exports = InterfaceService;
