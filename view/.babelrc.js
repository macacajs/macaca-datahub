'use strict';

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [
    [
      'import',
      {
        'libraryName': 'antd',
        'libraryDirectory': 'lib',
        'style': 'css'
      }
    ],
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties'
  ],
  env: {
    test: {
      plugins: [
        'istanbul'
      ]
    }
  }
};
