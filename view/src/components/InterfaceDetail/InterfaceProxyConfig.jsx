import React, { Component } from 'react';

import { Switch, Button, Popover, Tooltip, Popconfirm } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';

import { Row, Col } from 'react-flexbox-grid';

import { injectIntl } from 'react-intl';

import ProxyForm from '../forms/ProxyForm';

class InterfaceProxyConfig extends Component {
  state = {
    proxyFormVisible: false,
    proxyFormLoading: false,
  };

  defaultColProps = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 3,
  };

  formatMessage = (id) => this.props.intl.formatMessage({ id });

  showProxyForm = () => {
    this.setState({
      proxyFormVisible: true,
    });
  };

  hideProxyForm = () => {
    this.setState({
      proxyFormVisible: false,
    });
  };

  confirmProxyForm = async (value) => {
    this.setState({
      proxyFormLoading: true,
    });
    await this.props.addProxy(value);
    this.setState({
      proxyFormLoading: false,
    });
    this.setState({
      proxyFormVisible: false,
    });
  };

  renderProxyList = () => {
    const disabled = !this.props.selectedInterface.proxyConfig.enabled;
    const { proxyList = [], activeIndex = 0 } = this.props.proxyConfig;
    return (
      <Row>
        {proxyList.map((value, index) => {
          const classNames = ['common-list-item'];
          if (disabled) classNames.push('disabled');
          if (index === activeIndex) classNames.push('common-list-item-active');
          return (
            <Col key={index} data-accessbilityid={`project-api-proxy-list-${index}`} {...this.defaultColProps}>
              <div className={classNames.join(' ')}>
                <div className="common-list-item-name" onClick={() => !disabled && this.props.selectProxy(index)}>
                  <Popover content={value.proxyUrl}>{value.proxyUrl}</Popover>
                </div>
                {!disabled && (
                  <div className="common-list-item-operation">
                    <Tooltip title={this.formatMessage('common.delete')}>
                      <Popconfirm
                        placement="right"
                        title={this.formatMessage('common.deleteTip')}
                        onConfirm={() => this.props.deleteProxy(index)}
                        okText={this.formatMessage('common.confirm')}
                        cancelText={this.formatMessage('common.cancel')}
                      >
                        <DeleteOutlined />
                      </Popconfirm>
                    </Tooltip>
                  </div>
                )}
              </div>
            </Col>
          );
        })}
      </Row>
    );
  };

  render () {
    const props = this.props;
    const formatMessage = this.formatMessage;
    const { enabled, proxyList = [] } = props.proxyConfig;
    const globalSwitchProps = { checked: props.globalProxyEnabled };
    const switchProps = { checked: enabled };
    const disabled = !props.selectedInterface.proxyConfig.enabled;

    if (
      window.pageConfig &&
      window.pageConfig.featureConfig &&
      window.pageConfig.featureConfig.enableRequestProxy === false
    ) {
      return null;
    }

    return (
      <section>
        <h1>{formatMessage('interfaceDetail.proxyConfig')}</h1>
        <Row>
          <Col {...this.defaultColProps} style={{ lineHeight: '30px' }}>
            <Switch data-accessbilityid="project-api-solo-switch" {...switchProps} onChange={props.toggleProxy} />
            <span style={{ marginLeft: '10px', verticalAlign: 'middle' }}>
              {formatMessage(`proxyConfig.enable.${enabled || false}`)}
            </span>
          </Col>
          <Col {...this.defaultColProps}>
            <Button
              data-accessbilityid="project-api-add-proxy-btn"
              disabled={disabled}
              type="primary"
              onClick={this.showProxyForm}
            >
              {formatMessage('proxyConfig.addProxyUrl')}
            </Button>
          </Col>
          <Col {...this.defaultColProps}>
            <Switch
              data-accessbilityid="project-api-global-switch"
              {...globalSwitchProps}
              onChange={props.toggleGlobalProxy}
            />
            <span style={{ marginLeft: '10px', verticalAlign: 'middle' }}>
              {formatMessage(`proxyConfig.globalEnable.${props.globalProxyEnabled || false}`)}
            </span>
          </Col>
        </Row>
        <div>{proxyList.length ? formatMessage('proxyConfig.switchProxyUrlHint') : ''}</div>
        {this.renderProxyList()}
        <ProxyForm
          visible={this.state.proxyFormVisible}
          confirmLoading={this.state.proxyFormLoading}
          onCancel={this.hideProxyForm}
          onOk={this.confirmProxyForm}
        />
      </section>
    );
  }
}

export default injectIntl(InterfaceProxyConfig);
