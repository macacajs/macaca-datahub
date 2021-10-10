'use strict';

import assert from 'assert';

import {
  driver,
  BASE_URL,
  setSceneCodeMirror,
} from './helper';

import {
  successScene,
  failScene,
} from './fixture/data';

describe('test/datahub-api-scene.test.js', () => {
  describe('project api scene testing', () => {
    before(() => {
      return driver
        .initWindow({
          width: 960,
          height: 720,
          deviceScaleFactor: 2,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 Language/zh-CN',
        });
    });

    afterEach(function () {
      return driver
        .sleep(1000)
        .coverage()
        .saveScreenshots(this);
    });

    after(() => {
      return driver
        // delete project
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] .delete-icon')
        .click()
        .sleep(1500)
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1500)
        // quit
        .openReporter(false)
        .quit();
    });

    it('add project should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .elementByCss('#projectName')
        .click()
        .formInput('datahubview')
        .sleep(1500)
        .elementByCss('#description')
        .click()
        .formInput('DataHub Mock Data')
        .sleep(1500)
        .waitForElementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1500);
    });

    it('add api should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-btn"]')
        .click()
        .elementByCss('#pathname')
        .click()
        .formInput('init')
        .sleep(1500)
        .elementByCss('#description')
        .click()
        .formInput('init api get')
        .sleep(1500)
        .waitForElementByCss('#method .ant-select-selection')
        .click()
        .waitForElementByCss('.ant-select-dropdown-menu-item:nth-child(2)')
        .click()
        .sleep(1500)
        .waitForElementByCss('.ant-modal-footer .ant-btn-primary')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-0"] h3')
        .hasText('init')
        .sleep(1500);
    });

    it('add default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1500)

        // add default scene
        .waitForElementByCss('[data-accessbilityid="project-api-scene-add-btn"]')
        .click()
        .elementByCss('#sceneName')
        .click()
        .formInput('default')
        .sleep(1500)
        .execute(setSceneCodeMirror(successScene))
        .sleep(1500)
        .waitForElementByCss('.ant-modal-footer .ant-btn-primary')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-0"] .common-list-item-name')
        .hasText('default')
        .sleep(1500);
    });

    it('add error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .sleep(1500)

        // add default scene
        .waitForElementByCss('[data-accessbilityid="project-api-scene-add-btn"]')
        .click()
        .elementByCss('#sceneName')
        .click()
        .formInput('error')
        .sleep(1500)
        .execute(setSceneCodeMirror(failScene))
        .sleep(1500)
        .waitForElementByCss('.ant-modal-footer .ant-btn-primary')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-1"] .common-list-item-name')
        .hasText('error')
        .sleep(1500);
    });

    it('switch default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-0"] .common-list-item-name')
        .click()
        .sleep(1500)
        .getUrl(`${BASE_URL}/data/datahubview/init`)
        .waitForElementByCss('body')
        /* eslint-disable */
        .hasText(JSON.stringify(successScene));
        /* eslint-enable */
    });

    it('realtime should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="tabs-container"] [role="tab"]:last-child')
        .click()
        .execute('fetch("http://localhost:5678/data/datahubview/init")')
        .sleep(1000)
        .execute('fetch("http://localhost:5678/data/datahubview/init")')
        .sleep(1000)
        .waitForElementByCss('[data-accessbilityid="real-time-line-1"]')
        .click()
        .waitForElementByCss('[data-accessbilityid="real-time-save-to"] button')
        .click()
        .waitForElementByCss('#sceneName')
        .click()
        .formInput('realtime')
        .sleep(1500)
        .waitForElementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
        .click()
        .sleep(1500);
    });

    it('switch error scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-1"] .common-list-item-name')
        .click()
        .getUrl(`${BASE_URL}/data/datahubview/init`)
        .waitForElementByCss('body')
        /* eslint-disable */
        .hasText(JSON.stringify(failScene));
        /* eslint-enable */
    });

    it('delete realtime scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-2"] .anticon-delete')
        .click()
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1500)
        .elementOrNull('[data-accessbilityid="project-api-scene-list-2"] .scene-name')
        .then(value => assert.equal(value, null));
    });

    it('delete default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-1"] .anticon-delete')
        .click()
        .sleep(1500)
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(3000)
        .elementOrNull('[data-accessbilityid="project-api-scene-list-1"] .anticon-delete')
        .then(value => assert.equal(value, null));
    });

    it('delete default scene should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-api-scene-list-0"] .anticon-delete')
        .click()
        .sleep(1500)
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(3000)
        .elementOrNull('[data-accessbilityid="project-api-scene-list-0"] .anticon-delete')
        .then(value => assert.equal(value, null));
    });
  });
});
