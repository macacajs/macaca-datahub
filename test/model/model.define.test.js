'use strict';

const { assert, app } = require('egg-mock/bootstrap');

describe('test/app/model.define.js', () => {
  let ctx;
  beforeEach(() => {
    ctx = app.mockContext();
  });

  it('Project model', () => {
    const attributes = ctx.model.Project.tableAttributes;
    const map = {
      projectName: 'STRING',
      description: 'STRING',
      globalProxy: 'STRING',
      uniqId: 'UUID',
      createdAt: 'DATE',
      updatedAt: 'DATE',
    };
    for (const k in map) {
      assert(map[k] === attributes[k].type.constructor.key);
    }
    assert(Object.keys(map).length === Object.keys(attributes).length);
  });

  it('Interface model', () => {
    const attributes = ctx.model.Interface.tableAttributes;
    const map = {
      protocol: 'STRING',
      pathname: 'STRING',
      method: 'STRING',
      projectUniqId: 'STRING',
      description: 'STRING',
      currentScene: 'STRING',
      proxyConfig: 'JSON',
      contextConfig: 'JSON',
      uniqId: 'UUID',
      createdAt: 'DATE',
      updatedAt: 'DATE',
    };
    for (const k in map) {
      assert(map[k] === attributes[k].type.constructor.key);
    }
    assert(Object.keys(map).length === Object.keys(attributes).length);
  });

  it('Scene model', () => {
    const attributes = ctx.model.Scene.tableAttributes;
    const map = {
      sceneName: 'STRING',
      data: 'JSON',
      interfaceUniqId: 'STRING',
      uniqId: 'UUID',
      createdAt: 'DATE',
      updatedAt: 'DATE',
    };
    for (const k in map) {
      assert(map[k] === attributes[k].type.constructor.key);
    }
    assert(Object.keys(map).length === Object.keys(attributes).length);
  });

  it('Schema model', () => {
    const attributes = ctx.model.Schema.tableAttributes;
    const map = {
      type: 'STRING',
      data: 'JSON',
      interfaceUniqId: 'STRING',
      uniqId: 'UUID',
      createdAt: 'DATE',
      updatedAt: 'DATE',
    };
    for (const k in map) {
      assert(map[k] === attributes[k].type.constructor.key);
    }
    assert(Object.keys(map).length === Object.keys(attributes).length);
  });
});
