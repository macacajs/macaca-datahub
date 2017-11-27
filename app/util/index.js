'use strict';

module.exports.pack = scenes => {
  for (const scene of scenes) {
    scene.data = JSON.stringify(scene.data);
  }
  return JSON.stringify(scenes);
};

module.exports.unpack = scenes => {
  return JSON.parse(scenes).map(scene => {
    scene.data = JSON.parse(scene.data);
    return scene;
  });
};

