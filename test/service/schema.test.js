'use strict';

const { assert, app } = require('egg-mock/bootstrap');

describe('test/app/service/schema.test.js', () => {
  let ctx;
  let projectUniqId;
  let interfaceUniqId;

  beforeEach(async () => {
    ctx = app.mockContext();
    const { uniqId: pid } = await ctx.model.Project.create(
      { projectName: 'baz', description: 'bazd' }
    );
    projectUniqId = pid;
    const { uniqId: iid } = await ctx.model.Interface.create(
      { projectUniqId, pathname: 'api/one', method: 'ALL', description: '' }
    );
    interfaceUniqId = iid;
  });

  it('querySchemaByInterfaceUniqId', async () => {
    const requestSchema = {
      type: 'object',
      required: [
        'id',
      ],
      properties: {
        id: {
          type: 'string',
          description: 'request param id',
        },
      },
    };
    const responseSchema = {
      type: 'object',
      required: [
        'success',
      ],
      properties: {
        success: {
          type: 'boolean',
          description: 'server side success',
        },
        data: {
          type: 'array',
          description: 'data field',
          required: [
            'age',
            'key',
            'name',
            'address',
          ],
          items: [
            {
              type: 'object',
              required: [
                'name',
              ],
              properties: {
                key: {
                  type: 'string',
                  description: 'key description',
                },
                name: {
                  type: 'string',
                  description: 'name description',
                },
                age: {
                  type: 'number',
                  description: 'age description',
                },
                address: {
                  type: 'string',
                  description: 'address description',
                },
              },
            },
          ],
        },
        errorMessage: {
          type: 'string',
          description: 'error message description',
        },
      },
    };

    await ctx.model.Schema.bulkCreate([
      { interfaceUniqId, type: 'request', data: { schemaData: requestSchema } },
      { interfaceUniqId, type: 'response', data: { schemaData: responseSchema } },
    ]);
    const res = await ctx.service.schema.querySchemaByInterfaceUniqId({
      interfaceUniqId,
    });
    assert(res.length === 2);
    assert(res[0] instanceof ctx.model.Schema);
    assert(res[1] instanceof ctx.model.Schema);
    assert(res[0].type === 'request');
    assert.deepStrictEqual(res[0].data.schemaData, requestSchema);
    assert(res[0].interfaceUniqId === interfaceUniqId);
    assert(res[1].type === 'response');
    assert.deepStrictEqual(res[1].data.schemaData, responseSchema);
    assert(res[1].interfaceUniqId === interfaceUniqId);
  });

  it('updateSchema', async () => {
    const requestSchema = {
      type: 'object',
      required: [
        'id',
      ],
      properties: {
        id: {
          type: 'string',
          description: 'request param id',
        },
      },
    };

    await ctx.service.schema.updateSchema({
      interfaceUniqId, type: 'request',
      payload: {
        schemaData: requestSchema,
        enableSchemaValidate: true,
      },
    });

    let res = await ctx.model.Schema.findOne({
      where: {
        interfaceUniqId,
        type: 'request',
      },
    });

    assert(res instanceof ctx.model.Schema);
    assert(res.type === 'request');
    assert.deepStrictEqual(res.data.schemaData, requestSchema);
    assert.deepStrictEqual(res.data.enableSchemaValidate, true);
    assert(res.interfaceUniqId === interfaceUniqId);

    await ctx.service.schema.updateSchema({
      interfaceUniqId, type: 'request',
      payload: {
        enableSchemaValidate: false,
      },
    });

    res = await ctx.model.Schema.findOne({
      where: {
        interfaceUniqId,
        type: 'request',
      },
    });

    assert(res instanceof ctx.model.Schema);
    assert(res.type === 'request');
    assert.deepStrictEqual(res.data.schemaData, requestSchema);
    assert.deepStrictEqual(res.data.enableSchemaValidate, false);
    assert(res.interfaceUniqId === interfaceUniqId);
  });
});
