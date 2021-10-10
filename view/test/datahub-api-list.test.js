'use strict';

import assert from 'assert';

import {
  driver,
  BASE_URL,
} from './helper';

describe('test/datahub-api-list.test.js', () => {
  describe('project api list render testing', () => {
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
        .click();
    });

    it('add api should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        // add init api GET
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
        .sleep(1500)

        // add init api POST
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-btn"]')
        .click()
        .elementByCss('#pathname')
        .click()
        .formInput('init')
        .sleep(1500)
        .elementByCss('#description')
        .click()
        .formInput('init api post')
        .sleep(1500)
        .waitForElementByCss('#method .ant-select-selection')
        .click()
        .waitForElementByCss('.ant-select-dropdown-menu-item:nth-child(3)')
        .click()
        .sleep(1500)
        .waitForElementByCss('.ant-modal-footer .ant-btn-primary')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-1"] h3')
        .hasText('init')
        .sleep(1500)


        // add result api POST
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-btn"]')
        .click()
        .elementByCss('#pathname')
        .click()
        .formInput('result')
        .sleep(1500)
        .elementByCss('#description')
        .click()
        .formInput('result api ALL')
        .sleep(1500)
        .waitForElementByCss('#method .ant-select-selection')
        .click()
        .waitForElementByCss('.ant-select-dropdown-menu-item:nth-child(1)')
        .click()
        .sleep(1500)
        .waitForElementByCss('.ant-modal-footer .ant-btn-primary')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-2"] h3')
        .hasText('result')
        .sleep(1500)

        // input should be empty after add projct
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-btn"]')
        .click()
        .elementByCss('#pathname')
        .text()
        .then(value => assert.equal(value, ''))
        .sleep(1500)
        .elementByCss('#description')
        .text()
        .then(value => assert.equal(value, ''));
    });

    it('search api should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .elementByCss('[data-accessbilityid="project-search-api"]')
        .formInput('result')
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-0"] h3')
        .hasText('result');
    });

    it('modify api should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-0"] .anticon-setting')
        .click()
        .elementByCss('#pathname')
        .click()
        .formInput('new_init')
        .sleep(1500)
        .elementByCss('#description')
        .click()
        .formInput('new init api get')
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
        .hasText('new_init')
        .sleep(1500);
    });

    // delete on add api successfully
    it('delete api should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/project/datahubview`)
        // delete init all api
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-2"] .anticon-delete')
        .click()
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1500)
        // delete init get api
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-1"] .anticon-delete')
        .click()
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .sleep(1500)
        // delete init post api
        .waitForElementByCss('[data-accessbilityid="project-add-api-list-0"] .anticon-delete')
        .click()
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click();
    });
  });
});
