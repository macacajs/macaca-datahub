'use strict';

const {
  app,
} = require('egg-mock/bootstrap');

describe('test/app/controller/schedule/backup_data.test.js', () => {

  it('GET /data/baz/api/path', async () => {
    await app.runSchedule('backup_data');
  });
});
