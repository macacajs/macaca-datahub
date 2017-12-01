'use strict';

module.exports = app => {
  app.get('/', app.controller.page.home);
  app.get('/dashboard', app.controller.page.dashboard);
  app.get('/project/:projectId', app.controller.page.project);
  app.get('/doc/:projectId', app.controller.page.doc);
  app.get('/notfound', app.controller.page.notfound);

  app.all('/data/:projectId/:dataId', app.controller.api.data.index);

  app.get('/api/project', app.controller.api.project.query);
  app.post('/api/project', app.controller.api.project.upsert);
  app.delete('/api/project', app.controller.api.project.remove);

  app.get('/api/data/:projectId', app.controller.api.data.query);
  app.post('/api/data/:projectId', app.controller.api.data.add);
  app.post('/api/data/:projectId/:dataId', app.controller.api.data.update);
  app.delete('/api/data/:projectId/:dataId', app.controller.api.data.remove);
};
