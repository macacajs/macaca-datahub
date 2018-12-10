'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/api/schema.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
  });

  it('PUT /api/schema/:type update schema data', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const { body: createBody } = await app.httpRequest()
      .put('/api/schema/request')
      .send({
        interfaceUniqId,
        schemaData: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              login: {
                type: 'string',
                description: '',
              },
              id: {
                type: 'number',
                description: '',
              },
            },
            required: [
              'id',
            ],
          },
        },
      });
    assert.deepStrictEqual(createBody, {
      success: true,
      data: {},
    });

    const { body: createBody2 } = await app.httpRequest()
      .get(`/api/schema?interfaceUniqId=${interfaceUniqId}`);
    assert.deepStrictEqual(createBody2.data[0].data, {
      schemaData: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            login: {
              type: 'string',
              description: '',
            },
            id: {
              type: 'number',
              description: '',
            },
          },
          required: [
            'id',
          ],
        },
      },
    });
  });
});
