import React, { Component } from 'react';

import { Drawer, Switch } from 'antd';

import { ExperimentOutlined } from '@ant-design/icons';

import { injectIntl, FormattedMessage } from 'react-intl';

import { setExperimentConfig } from '../common/helper';
import styles from './Experiment.module.less';

const serverFeatureConfig = window.pageConfig.featureConfig || {};

const compareVersion = (base, target) => {
  // assuming simple semver
  if (!(/^\d+\.\d+\.\d+$/.test(base) && /^\d+\.\d+\.\d+$/.test(target))) {
    return;
  }
  const baseVersion = base.split('.');
  const targetVersion = target.split('.');

  for (let i = 0, n1, n2; i < baseVersion.length; i++) {
    n1 = parseInt(targetVersion[i], 10) || 0;
    n2 = parseInt(baseVersion[i], 10) || 0;

    if (n1 > n2) return -1;
    if (n1 < n2) return 1;
  }

  return 0;
};

class Experiment extends Component {
  state = {
    showPanel: false,
  };

  formatMessage = (id) => {
    return this.props.intl.formatMessage({ id });
  };

  toggleDownloadAndUpload = (value) => {
    setExperimentConfig({
      isOpenDownloadAndUpload: value,
    });
    this.props.updateExperimentConfig({
      isOpenDownloadAndUpload: value,
    });
  };

  toggleCompactView = (value) => {
    setExperimentConfig({
      isOpenCompactView: value,
    });
    this.props.updateExperimentConfig({
      isOpenCompactView: value,
    });
  };

  toggleRunJsMode = (value) => {
    setExperimentConfig({
      isOpenRunJsMode: value,
    });
    this.props.updateExperimentConfig({
      isOpenRunJsMode: value,
    });
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <Drawer
          title={this.formatMessage('experiment.title')}
          placement="right"
          onClose={() => {
            this.setState({ showPanel: false });
          }}
          visible={this.state.showPanel}
          width="30%"
          className={styles.drawer}
        >
          <section className={styles.item}>
            <label style={{ verticalAlign: 'middle' }}>
              <FormattedMessage id="experiment.downloadAndUpload" />
            </label>
            <Switch
              data-accessbilityid="experiment-donwloadupload-switch"
              checkedChildren={this.formatMessage('experiment.open')}
              unCheckedChildren={this.formatMessage('experiment.close')}
              onChange={this.toggleDownloadAndUpload}
              defaultChecked={this.props.experimentConfig.isOpenDownloadAndUpload}
            />
            {compareVersion(window.pageConfig.version, '2.2.10') === -1 && (
              <span style={{ marginLeft: '8px' }}>(Only for Datahub>=2.2.10)</span>
            )}
          </section>
          {serverFeatureConfig.enableJavascript && (
            <section className={styles.item}>
              <label style={{ verticalAlign: 'middle' }}>
                <FormattedMessage id="experiment.runJsMode" />
              </label>
              <Switch
                data-accessbilityid="experiment-compactview-switch"
                checkedChildren={this.formatMessage('experiment.open')}
                unCheckedChildren={this.formatMessage('experiment.close')}
                onChange={this.toggleRunJsMode}
                defaultChecked={this.props.experimentConfig.isOpenRunJsMode}
              />
            </section>
          )}
          <section className={styles.item}>
            <label style={{ verticalAlign: 'middle' }}>
              <FormattedMessage id="experiment.compactView" />
            </label>
            <Switch
              data-accessbilityid="experiment-compactview-switch"
              checkedChildren={this.formatMessage('experiment.open')}
              unCheckedChildren={this.formatMessage('experiment.close')}
              onChange={this.toggleCompactView}
              defaultChecked={this.props.experimentConfig.isOpenCompactView}
            />
          </section>
          <hr />
          <p>
            <FormattedMessage id="experiment.description" />
          </p>
          <p>
            <FormattedMessage id="experiment.tips1" />
          </p>
          <p>
            <FormattedMessage id="experiment.tips2" />
            <a href="https://github.com/macacajs/macaca-datahub/issues" target="_blank">
              issue
            </a>
          </p>
        </Drawer>
        <a
          data-accessbilityid="experiment-container"
          onClick={() => {
            return this.setState({ showPanel: true });
          }}
        >
          <ExperimentOutlined />
          Lab
        </a>
      </div>
    );
  }
}

export default injectIntl(Experiment);
