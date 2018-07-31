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

  async updateSchema({ interfaceUniqId, type, data }) {
    return await this.ctx.model.Schema.upsert({
      interfaceUniqId, type, data,
    });
  }
}

module.exports = SchemaService;
