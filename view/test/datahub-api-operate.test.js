'use strict';

import assert from 'assert';

import { driver, BASE_URL, setMonacoEditor } from './helper';

import { schemaData } from './fixture/data';

describe('test/datahub-api-operate.test.js', () => {
  describe('project api scene testing', () => {
    before(() => {
      return driver.initWindow({
        width: 960,
        height: 720,
        deviceScaleFactor: 2,
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 Language/zh-CN',
      });
    });

    afterEach(function () {
      return driver.sleep(1000).coverage().saveScreenshots(this);
    });

    after(() => {
      return (
        driver
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
          .quit()
      );
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
        .elementByCss('#globalProxy')
        .click()
        .formInput('http://127.0.0.1')
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

    it('modify api proxy config should be ok', () => {
      return (
        driver
          .getUrl(`${BASE_URL}/project/datahubview`)
          // open proxy
          .waitForElementByCss('[data-accessbilityid="project-api-solo-switch"]')
          .click()
          // check global proxy
          .waitForElementByCss('[data-accessbilityid="project-api-proxy-list-0"] .common-list-item-name span')
          .hasText('http://127.0.0.1')
          // add 1 proxy
          .waitForElementByCss('[data-accessbilityid="project-api-add-proxy-btn"]:not([disabled])')
          .click()
          .waitForElementByCss('#proxyUrl', 4000)
          .clear()
          .formInput('http://datahub1.com')
          .sleep(1500)
          .waitForElementByCss('.ant-modal-footer .ant-btn-primary')
          .click()
          .sleep(1500)
          // check 1 proxy
          .refresh()
          .sleep(1500)
          .waitForElementByCss('[data-accessbilityid="project-api-proxy-list-1"] .common-list-item-name span')
          .hasText('http://datahub1.com')

          // add 2 proxy
          .waitForElementByCss('[data-accessbilityid="project-api-add-proxy-btn"]')
          .click()
          .waitForElementByCss('#proxyUrl', 4000)
          .clear()
          .formInput('http://datahub2.com')
          .sleep(1500)
          .waitForElementByCss('.ant-modal-footer .ant-btn-primary')
          .click()
          .sleep(1500)
          // check 2 proxy
          .refresh()
          .sleep(1500)
          .waitForElementByCss('[data-accessbilityid="project-api-proxy-list-2"] .common-list-item-name span')
          .hasText('http://datahub2.com')

          // delete 2 proxy
          .waitForElementByCss('[data-accessbilityid="project-api-proxy-list-2"] .anticon-delete')
          .click()
          .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
          .click()
          .sleep(1500)

          // can't delete proxy after close proxy
          .waitForElementByCss('[data-accessbilityid="project-api-solo-switch"]')
          .click()
          .elementOrNull('[data-accessbilityid="project-api-proxy-list-1"] .common-list-item.disabled')
          .then((value) => assert.equal(value, null))
          .sleep(1500)
      );
    });

    it('modify api req schema should be ok', () => {
      return (
        driver
          .getUrl(`${BASE_URL}/project/datahubview`)
          // Request Schema
          .waitForElementByCss('.api-schema-req [data-accessbilityid="project-api-schema-edit-btn"]')
          .click()
          .execute(setMonacoEditor(schemaData))
          .waitForElementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
          .click()
          .sleep(1500)
          .refresh()
          .waitForElementByCss('.api-schema-req table > tbody > tr:nth-child(1) > td:nth-child(1)')
          .hasText('success')
      );
    });

    it('modify api res schema should be ok', () => {
      return (
        driver
          .getUrl(`${BASE_URL}/project/datahubview`)
          // Response Schema
          .waitForElementByCss('.api-schema-res [data-accessbilityid="project-api-schema-edit-btn"]')
          .click()
          .execute(setMonacoEditor(schemaData))
          .waitForElementByCss('.ant-modal-footer .ant-btn.ant-btn-primary')
          .click()
          .sleep(1500)
          .waitForElementByCss('.api-schema-res table > tbody > tr:nth-child(1) > td:nth-child(2)')
          .hasText('Boolean')
      );
    });

    // rely on add schema successfully
    it('api doc should be ok', () => {
      return driver
        .getUrl(`${BASE_URL}/doc/datahubview#api=init`)
        .waitForElementByCss('.api-schema-req tbody > tr:nth-child(1) > td:nth-child(1)')
        .hasText('success')
        .waitForElementByCss('.api-schema-res tbody > tr:nth-child(2) > td:nth-child(1) > div')
        .click()
        .waitForElementByCss('.api-schema-res tbody > tr:nth-child(6) > td:nth-child(1)')
        .hasText('address');
    });
  });
});
