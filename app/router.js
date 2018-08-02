'use strict';

const compose = require('koa-compose');

module.exports = app => {
  const {
    router,
    controller,
    middleware,
  } = app;

  const contextMiddleWare = compose([
    middleware.socketEmit(),
    middleware.schemaValidation(),
    middleware.contextCors(),
    middleware.contextDelay(),
    middleware.contextStatus(),
    middleware.contextResponseHeaders(),
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
  router.put('/api/schema/:type', controller.api.schema.update);

  router.post('/api/sdk/switch_scene', controller.api.sdk.switchScene);
  router.post('/api/sdk/switch_multi_scenes', controller.api.sdk.switchMultiScenes);
  router.post('/api/sdk/switch_all_scenes', controller.api.sdk.switchAllScenes);

  router.all('/data/:projectName/:pathname+', contextMiddleWare, controller.data.index);
};
