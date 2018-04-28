'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

const _ = require('xutil');

describe('app/controller/api/project.js', () => {
  describe('GET /api/project', () => {
    it('return projects', async () => {
      const expected = [
        { id: 1,
          identifer: 'identifer-1',
          description: 'description 2',
          created_at: _.moment().format('YY-MM-DD'),
          updated_at: _.moment().format('YY-MM-DD'),
        },
        {
          id: 2,
          identifer: 'identifer-2',
          description: 'description 2',
          created_at: _.moment().format('YY-MM-DD'),
          updated_at: _.moment().format('YY-MM-DD'),
        },
      ];

      app.mockService('project', 'query', () => {
        return expected;
      });

      await app.httpRequest()
        .get('/api/project')
        .expect(200)
        .expect(expected);
    });
  });

  describe('POST /api/project', () => {
    it('create project', async () => {
      app.mockService('project', 'upsertById', async (identifer, body) => {
        assert(identifer === 'some identifer');
        assert(body.identifer === 'some identifer');
        assert(body.description === 'some description');
        return [];
      });

      await app.httpRequest()
        .post('/api/project')
        .set('Content-Type', 'application/json')
        .send({
          identifer: 'some identifer',
          description: 'some description',
        })
        .expect(200)
        .expect({ success: true });
    });

    it('will not create project', async () => {
      app.mockService('project', 'upsertById', async () => {
        return null;
      });

      await app.httpRequest()
        .post('/api/project')
        .set('Content-Type', 'application/json')
        .send({
          identifer: 'some identifer',
          description: 'some description',
        })
        .expect(200)
        .expect({ success: false });
    });
  });

  describe('DELETE /api/project', () => {
    it('remove project', async () => {
      app.mockService('project', 'removeById', async identifer => {
        assert(identifer === 'some identifer');
        return [];
      });

      await app.httpRequest()
        .delete('/api/project')
        .set('Content-Type', 'application/json')
        .send({
          identifer: 'some identifer',
        })
        .expect(200)
        .expect({ success: true });
    });

    it('will not remove project', async () => {
      app.mockService('project', 'removeById', async () => {
        return null;
      });

      await app.httpRequest()
        .delete('/api/project')
        .set('Content-Type', 'application/json')
        .send({
          identifer: 'foo',
        })
        .expect(200)
        .expect({ success: false });
    });
  });
});
