'use strict';

// will auto export and import data if store is set
module.exports = {
  mode: 'local',
  port: 7001,
  // store: require('path').join(__dirname, 'data'),
  view: {
    assetsUrl: 'https://npmcdn.com/datahub-view@2',
    // assetsUrl: 'http://localhost:8080',
  },
};
