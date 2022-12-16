import React, { Component } from 'react';
import { Drawer, Switch } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
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
          title={__i18n('实验功能')}
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
              {__i18n('上传和下载功能：')}
            </label>
            <Switch
              data-accessbilityid="experiment-donwloadupload-switch"
              checkedChildren={__i18n('开')}
              unCheckedChildren={__i18n('关')}
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
                {__i18n('动态执行脚本：')}
              </label>
              <Switch
                data-accessbilityid="experiment-compactview-switch"
                checkedChildren={__i18n('开')}
                unCheckedChildren={__i18n('关')}
                onChange={this.toggleRunJsMode}
                defaultChecked={this.props.experimentConfig.isOpenRunJsMode}
              />
            </section>
          )}
          <section className={styles.item}>
            <label style={{ verticalAlign: 'middle' }}>
              {__i18n('紧凑模式：')}
            </label>
            <Switch
              data-accessbilityid="experiment-compactview-switch"
              checkedChildren={__i18n('开')}
              unCheckedChildren={__i18n('关')}
              onChange={this.toggleCompactView}
              defaultChecked={this.props.experimentConfig.isOpenCompactView}
            />
          </section>
          <hr />
          <p>
            {__i18n('显示一些功能')}
          </p>
          <p>
            {__i18n('全局设置')}
          </p>
          <p>
            {__i18n('你需要什么功能？')}
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
          <ExperimentOutlined /> Lab
        </a>
      </div>
    );
  }
}

export default Experiment;
