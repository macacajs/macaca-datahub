'use strict';

const path = require('path');

module.exports = {
  srcDirs: [
    'view/**/*.*',
  ],
  distDir: path.resolve(__dirname, 'view/src/locale'),
  tokenName: '__i18n',
  debug: true,
};
