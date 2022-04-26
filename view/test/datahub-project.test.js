import assert from 'assert';

import { driver, BASE_URL } from './helper';

describe('test/datahub-project.test.js', () => {
  describe('project page render testing', () => {
    before(() =>
      driver.initWindow({
        width: 960,
        height: 720,
        deviceScaleFactor: 2,
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36 Language/zh-CN',
      }),
    );

    afterEach(function () {
      return driver.sleep(1000).coverage().saveScreenshots(this);
    });

    after(() => driver.openReporter(false).quit());

    it('add project should be ok', () =>
      driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .waitForElementByCss('#projectName')
        .click()
        .formInput('datahubview')
        .waitForElementByCss('#description')
        .click()
        .formInput('DataHub Mock Data')
        .waitForElementByCss('#globalProxy')
        .click()
        .formInput('http://127.0.0.1')
        .waitForElementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] div.ant-card-head')
        .hasText('DataHub Mock Data')
        // input should be empty after add projct
        .waitForElementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .waitForElementByCss('#projectName')
        .text()
        .then((value) => assert.equal(value, ''))
        .waitForElementByCss('#description')
        .text()
        .then((value) => assert.equal(value, '')));

    it('add another project should be ok', () =>
      driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-folder-add"]')
        .click()
        .waitForElementByCss('#projectName')
        .click()
        .formInput('datahubview2')
        .waitForElementByCss('#description')
        .click()
        .formInput('DataHub Mock Data2')
        .waitForElementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-1"] div.ant-card-head')
        .hasText('DataHub Mock Data2'));

    it('switch project should be ok', () =>
      driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] i.anticon-inbox')
        .click()
        .waitForElementByCss('[data-accessbilityid="dropdonw-list"]')
        .click()
        .waitForElementByCss('[data-accessbilityid="dropdonw-list-1"] a')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="dropdonw-list"]')
        .hasText('datahubview2'));

    it('modify project should be ok', () =>
      driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] .anticon-setting')
        .click()
        .waitForElementByCss('#projectName')
        .click()
        .formInput('new_datahubview')
        .waitForElementByCss('#description')
        .click()
        .formInput('New DataHub Mock Data')
        .waitForElementByCss('button.ant-btn.ant-btn-primary')
        .click()
        .sleep(1000)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] div.ant-card-head')
        .hasText('New DataHub Mock Data'));

    it('open download project should be ok', () =>
      driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="experiment-container"] i.anticon-experiment')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="experiment-donwloadupload-switch"]')
        .click());

    it('open compact view should be ok', () =>
      driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="experiment-container"] i.anticon-experiment')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="experiment-compactview-switch"]')
        .click());

    it('close compact view should be ok', () =>
      driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="experiment-container"] i.anticon-experiment')
        .click()
        .sleep(1500)
        .waitForElementByCss('[data-accessbilityid="experiment-compactview-switch"]')
        .click());

    // depend on add project successfully
    it('delete project should be ok', () =>
      driver
        .getUrl(`${BASE_URL}/dashboard`)
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] .delete-icon')
        .click()
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .waitForElementByCss('[data-accessbilityid="dashboard-content-card-0"] .delete-icon')
        .click()
        .waitForElementByCss('.ant-popover-buttons .ant-btn-primary')
        .click()
        .elementOrNull('[data-accessbilityid="dashboard-content-card-0"] .ant-card-head')
        .then((value) => assert.equal(value, null)));
  });
});
