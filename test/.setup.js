'use strict';

const { app } = require('egg-mock/bootstrap');

const restore = async () => {
  await app.model.Project.truncate();
  await app.model.Interface.truncate();
  await app.model.Scene.truncate();
  await app.model.Schema.truncate();
  await app.model.Group.truncate();
}

before(restore)
afterEach(restore);
