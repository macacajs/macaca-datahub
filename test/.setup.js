'use strict';

const { app } = require('egg-mock/bootstrap');

before(async () => await app.model.sync({ force: true }))
afterEach(async () => await app.model.sync({ force: true }));
