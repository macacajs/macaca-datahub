'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('app/service/project.js', () => {
  it('find all project', async () => {
    const ctx = app.mockContext({ model: {
      Project: {
        findAll: options => {
          assert(options.raw === true);
          return [];
        },
      },
    } });

    await ctx.service.project.query();
  });

  it('update project', async () => {
    const body = {
      identifer: 'some identifer',
      description: 'some description',
    };

    const ctx = app.mockContext({ model: {
      Project: {
        upsert: (body, query) => {
          assert(body.identifer === 'some identifer');
          assert(body.description === 'some description');
          assert(query.where.identifer === 'some-identifier');
          return [];
        },
        findAll: () => { return []; },
      },
    } });

    await ctx.service.project.upsertById('some-identifier', body);
  });

  it('remove project', async () => {
    const ctx = app.mockContext({ model: {
      Project: {
        destroy: query => {
          assert(query.where.identifer === 'some-identifier');
          return [];
        },
        findAll: () => { return []; },
      },
    } });

    await ctx.service.project.removeById('some-identifier');
  });
});
