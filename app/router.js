'use strict';

const compose = require('koa-compose');

module.exports = app => {
  const {
    router,
    controller,
    middleware,
  } = app;

  const contextMiddleWare = compose([
    middleware.schemaValidation(),
    middleware.contextCors(),
    middleware.contextDelay(),
    middleware.contextStatus(),
    middleware.contextResponseHeaders(),
    middleware.socketEmit(),
  ]);

  router.get('/', controller.page.home);
  router.get('/dashboard', controller.page.dashboard);
  router.get('/project/:projectName', controller.page.project);
  router.get('/doc/:projectName', controller.page.doc);
  router.get('/notfound', controller.page.notfound);

  router.get('/api/project', controller.api.project.showAll);
  router.get('/api/project/:uniqId', controller.api.project.show);
  router.post('/api/project', controller.api.project.create);
  router.put('/api/project/:uniqId', controller.api.project.update);
  router.delete('/api/project/:uniqId', controller.api.project.delete);

  router.get('/api/interface', controller.api.interface.showAll);
  router.get('/api/interface/:uniqId', controller.api.interface.show);
  router.post('/api/interface', controller.api.interface.create);
  router.put('/api/interface/:uniqId', controller.api.interface.update);
  router.delete('/api/interface/:uniqId', controller.api.interface.delete);

  router.get('/api/scene', controller.api.scene.showAll);
  router.get('/api/scene/:uniqId', controller.api.scene.show);
  router.post('/api/scene', controller.api.scene.create);
  router.put('/api/scene/:uniqId', controller.api.scene.update);
  router.delete('/api/scene/:uniqId', controller.api.scene.delete);

  router.get('/api/schema', controller.api.schema.showAll);
  router.get('/api/schema/:uniqId', controller.api.schema.show);
  router.post('/api/schema', controller.api.schema.create);
  router.put('/api/schema/:uniqId', controller.api.schema.update);
  router.delete('/api/schema/:uniqId', controller.api.schema.delete);

  router.all('/data/:projectName/:pathname+', contextMiddleWare, controller.data.index);
};
