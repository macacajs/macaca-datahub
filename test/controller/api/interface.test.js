'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/interface.test.js', () => {
  let ctx;

  beforeEach(async () => {
    ctx = app.mockContext();
  });

  it('PUT /api/interface/:uniqId delete proxy', async () => {
    const [{ uniqId: projectUniqId }] = await ctx.model.Project.bulkCreate([
      { projectName: 'baz', description: 'bazd' },
    ]);
    const [{ uniqId: interfaceUniqId }] = await ctx.model.Interface.bulkCreate([
      { projectUniqId, pathname: 'api/path', method: 'ALL', description: 'description' },
    ]);
    const { body: createBody } = await app.httpRequest()
      .put(`/api/interface/${interfaceUniqId}`)
      .send({
        proxyConfig: {
          proxyList: [
            { proxyUrl: 'http://www.a.com' },
            { proxyUrl: 'http://www.b.com' },
          ],
          activeIndex: 1,
        },
      });
    assert.deepStrictEqual(createBody, {
      success: true, data: [ 1 ],
    });
    let interfaceData = await ctx.model.Interface.findOne({
      where: {
        uniqId: interfaceUniqId,
      },
    });
    assert(interfaceData.proxyConfig.activeIndex === 1);
    const { body: updateBody } = await app.httpRequest()
      .put(`/api/interface/${interfaceUniqId}`)
      .send({
        proxyConfig: {
          proxyList: [
            { proxyUrl: 'http://www.a.com' },
          ],
          activeIndex: 1,
        },
      });
    assert.deepStrictEqual(updateBody, {
      success: true, data: [ 1 ],
    });
    interfaceData = await ctx.model.Interface.findOne({
      where: {
        uniqId: interfaceUniqId,
      },
    });
    assert(interfaceData.proxyConfig.activeIndex === 0);
  });
});
