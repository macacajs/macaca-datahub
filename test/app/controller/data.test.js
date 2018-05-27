'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

const _ = require('xutil');

describe('app/controller/api/data.js', () => {
  describe('/data/:projectId/:dataId+', () => {
    describe('proxy true', () => {
      it('it proxy request', async () => {
        app.mockHttpclient('http://www.some.test?foo=bar', {
          data: JSON.stringify({ success: true }),
        });

        app.mockHttpclient('http://www.some.test/?foo=bar', {
          data: JSON.stringify({ success: true }),
        });

        app.mockService('data', 'getByProjectIdAndDataId', () => {
          return {
            created_at: _.moment().format('YY-MM-DD'),
            currentScene: 'default',
            delay: '0',
            description: 'test',
            id: 1,
            identifer: 'identifer',
            method: 'ALL',
            params: '{}',
            pathname: 'test',
            proxyContent: JSON.stringify({
              proxies: [ 'http://www.some.test' ],
              useProxy: true,
              originKeys: [ 1 ],
              currentProxyIndex: 1,
            }),
            reqSchemaContent: '{}',
            resSchemaContent: '{}',
            responseHeader: '{}',
            scenes: JSON.stringify([{
              name: 'default',
              data: {
                success: true,
              },
            }]),
          };
        });

        await app.httpRequest()
          .get('/data/identifer/test?foo=bar')
          .expect(200)
          .expect({ success: true })
          .then(response => {
            assert(response.header['x-datahub-proxy'] === 'true');
          });
      });
    });

    describe('proxy false', () => {
      let response;
      before(() => {
        response = {
          created_at: _.moment().format('YY-MM-DD'),
          currentScene: 'default',
          delay: '1',
          description: 'test',
          id: 1,
          identifer: 'identifer',
          method: 'ALL',
          params: '{}',
          pathname: 'test',
          proxyContent: '{}',
          reqSchemaContent: '{}',
          resSchemaContent: '{}',
          responseHeader: '{}',
          scenes: JSON.stringify([{ name: 'default', data: { success: true } }]),
        };
      });

      it('return scene', async () => {
        app.mockService('data', 'getByProjectIdAndDataId', () => {
          return response;
        });

        await app.httpRequest()
          .get('/data/identifer/test')
          .expect(200)
          .expect({ success: true });
      });

      it('added custom response header', async () => {
        app.mockService('data', 'getByProjectIdAndDataId', () => {
          return response;
        });

        await app.httpRequest()
          .get('/data/identifer/test')
          .expect(200)
          .then(response => {
            assert(response.header['x-datahub-delay'] === '1');
          });
      });
    });
  });
});
