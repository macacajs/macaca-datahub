'use strict';

module.exports = app => {
  const {
    router,
    controller,
  } = app;

  router.get('/', controller.page.home);
  router.get('/dashboard', controller.page.dashboard);
  router.get('/project/:projectId', controller.page.project);
  router.get('/doc/:projectId', controller.page.doc);
  router.get('/notfound', controller.page.notfound);

  router.all('/data/:projectId/:dataId', controller.api.data.index);

  router.get('/api/project', controller.api.project.query);
  router.post('/api/project', controller.api.project.upsert);
  router.delete('/api/project', controller.api.project.remove);

  router.get('/api/data/:projectId', controller.api.data.query);
  router.post('/api/data/:projectId', controller.api.data.add);
  router.post('/api/data/:projectId/:dataId', controller.api.data.update);
  router.delete('/api/data/:projectId/:dataId', controller.api.data.remove);
};
