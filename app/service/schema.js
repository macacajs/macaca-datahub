'use strict';

const Service = require('egg').Service;

class SchemaService extends Service {

  async querySchemaByInterfaceUniqId({ interfaceUniqId }, options = {}) {
    return await this.ctx.model.Schema.findAll({
      ...options,
      where: {
        interfaceUniqId,
      },
      order: [
        [
          'type',
          'ASC',
        ],
      ],
    });
  }

  async updateSchema({ interfaceUniqId, type, payload }) {
    const res = await this.ctx.model.Schema.findOne({
      where: { interfaceUniqId, type },
    });
    const newValue = {
      ...res.data,
      ...payload,
    };
    return await this.ctx.model.Schema.upsert({
      interfaceUniqId, type, data: newValue,
    });
  }
}

module.exports = SchemaService;
