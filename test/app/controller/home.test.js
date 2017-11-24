'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('app/controller/page.test.js', () => {

  it('should assert', function* () {
    const pkg = require('../../../package');
    assert(app.config.keys.startsWith(pkg.name));
  });

  it('should GET /', () => {
    return app.httpRequest()
      .get('/dashboard')
      .expect(200);
  });
});
