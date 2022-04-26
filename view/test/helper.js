import { webpackHelper } from 'macaca-wd';

const { driver } = webpackHelper;

const BASE_URL = 'http://localhost:5678';

driver.configureHttp({
  timeout: 100 * 1000,
  retries: 5,
  retryDelay: 5,
});

exports.driver = driver;
exports.BASE_URL = BASE_URL;

exports.setMonacoEditor = (d) =>
  /* eslint-disable */
  `document.querySelector('.MonacoEditor').MonacoEditor.setValue(\'${JSON.stringify(d)}\')`;
/* eslint-enable */

exports.setSceneMonacoEditor = (d) =>
  /* eslint-disable */
  `document.querySelector('.res-data .MonacoEditor').MonacoEditor.setValue(\'${JSON.stringify(d)}\')`;
