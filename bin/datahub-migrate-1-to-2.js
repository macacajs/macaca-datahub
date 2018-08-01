#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const rimraf = require('rimraf');
const program = require('commander');

program
  .option('-s, --store <s>', 'store path')
  .parse(process.argv);

if (!program.store) {
  program.help();
  process.exit(1);
}

const baseDir = path.resolve(program.store);
const archiveDataPath = path.join(baseDir, 'archive.data');
const hubDataPath = path.join(baseDir, 'hub.data');
if (!fs.existsSync(archiveDataPath)) {
  console.log(`${archiveDataPath} not exist!`);
  process.exit(0);
}
if (!fs.existsSync(hubDataPath)) {
  console.log(`${hubDataPath} not exist!`);
  process.exit(0);
}
console.log('migrate from store', baseDir);
const archiveData = JSON.parse(fs.readFileSync(archiveDataPath));
const projects = JSON.parse(fs.readFileSync(hubDataPath));


const dbPath = path.join(process.env.HOME, '.macaca-datahub');
if (fs.existsSync(dbPath)) {
  rimraf.sync(dbPath);
}

for (const project of projects) {

  // create project
  const projectUniqId = uuid();
  fs.writeFileSync(path.join(baseDir, `${project.identifer}.json`), JSON.stringify({
    projectName: project.identifer,
    description: project.description,
    uniqId: projectUniqId,
  }, null, 2));
  cdir(path.join(baseDir, project.identifer));
  const interfaceDataList = archiveData.filter(i => i.identifer === project.identifer);

  for (const interfaceData of interfaceDataList) {

    // create interface dir
    const interfaceDataUniqId = uuid();
    const exportName = interfaceData.identifer + '_' +
      interfaceData.method + '_' +
      interfaceData.pathname.replace(/[:/]/g, '_') + '_' +
      interfaceDataUniqId.substr(0, 4);
    cdir(path.join(
      baseDir,
      project.identifer,
      exportName
    ));

    // create scene
    cdir(path.join(
      baseDir,
      project.identifer,
      exportName,
      'scene'
    ));
    let defaultSceneName = '';
    let defaultSceneNamehasSet = false;
    const sceneList = JSON.parse(interfaceData.scenes) || [];
    for (const scene of sceneList) {
      const sceneUniqId = uuid();
      if (!defaultSceneNamehasSet) {
        defaultSceneName = scene.name;
        defaultSceneNamehasSet = true;
      }
      const { name, data } = scene;
      fs.writeFileSync(path.join(
        baseDir,
        project.identifer,
        exportName,
        'scene',
        `${name}.json`
      ), JSON.stringify({
        sceneName: name,
        data,
        interfaceUniqId: interfaceDataUniqId,
        uniqId: sceneUniqId,
      }, null, 2));
    }

    // create schema
    cdir(path.join(
      baseDir,
      project.identifer,
      exportName,
      'schema'
    ));
    const reqSchemaContent = JSON.parse(interfaceData.reqSchemaContent) || {};
    fs.writeFileSync(path.join(
      baseDir,
      project.identifer,
      exportName,
      'schema',
      'request.json'
    ), JSON.stringify({
      type: 'request',
      data: reqSchemaContent,
      interfaceUniqId: interfaceDataUniqId,
      uniqId: uuid(),
    }, null, 2));
    const resSchemaContent = JSON.parse(interfaceData.resSchemaContent) || {};
    fs.writeFileSync(path.join(
      baseDir,
      project.identifer,
      exportName,
      'schema',
      'response.json'
    ), JSON.stringify({
      type: 'response',
      data: resSchemaContent,
      interfaceUniqId: interfaceDataUniqId,
      uniqId: uuid(),
    }, null, 2));

    // create interface dir
    const proxyContent = JSON.parse(interfaceData.proxyContent);
    const proxyConfig = {};
    if (proxyContent.useProxy) proxyConfig.enabled = true;
    if (Array.isArray(proxyContent.proxies)) {
      proxyConfig.proxyList = proxyContent.proxies.map(i => ({
        proxyUrl: i,
      }));
    } else {
      proxyConfig.proxyList = [];
    }
    if (proxyContent.currentProxyIndex && Array.isArray(proxyContent.originKeys)) {
      const findIndex = proxyContent.originKeys.indexOf(proxyContent.currentProxyIndex);
      if (findIndex > -1) {
        proxyConfig.activeIndex = findIndex;
      }
    }
    fs.writeFileSync(path.join(baseDir, project.identifer, `${exportName}.json`), JSON.stringify({
      protocol: 'http',
      pathname: interfaceData.pathname,
      method: interfaceData.method,
      projectUniqId,
      description: interfaceData.description,
      currentScene: defaultSceneName,
      proxyConfig,
      contextConfig: {},
      uniqId: interfaceDataUniqId,
    }, null, 2));
  }
}

function cdir(dir) {
  rimraf.sync(dir);
  fs.mkdirSync(dir);
}
