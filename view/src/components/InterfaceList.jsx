'use strict';

import React, {
  Component,
} from 'react';

import {
  Row,
  Col,
  Icon,
  Input,
  Upload,
  Button,
  message,
  Tooltip,
  Popconfirm,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import InterfaceForm from './forms/InterfaceForm';

import { interfaceService } from '../service';

import './InterfaceList.less';

const Search = Input.Search;

const globalProxy = window.context && window.context.globalProxy;

class InterfaceList extends Component {
  state = {
    interfaceFormVisible: false,
    interfaceFormLoading: false,
    filterString: '',
    stageData: null,
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  showCreateForm = () => {
    this.setState({
      stageData: null,
      interfaceFormVisible: true,
    });
  }

  showUpdateForm = async value => {
    this.setState({
      stageData: value,
      interfaceFormVisible: true,
    });
  }

  closeInterfaceForm = () => {
    this.setState({
      interfaceFormVisible: false,
    });
  }

  confirmInterfaceForm = async ({ pathname, description, method }) => {
    this.setState({
      interfaceFormLoading: true,
    });
    const apiName = this.state.stageData
      ? 'updateInterface'
      : 'createInterface';
    const res = await interfaceService[apiName]({
      uniqId: this.state.stageData && this.state.stageData.uniqId,
      pathname,
      description,
      method,
    });

    // Add Global Proxy
    if (res.data &&
      res.data.uniqId &&
      apiName === 'createInterface' &&
      globalProxy
    ) {
      await interfaceService.updateInterface({
        uniqId: res.data.uniqId,
        proxyConfig: {
          enabled: false,
          proxyList: [{
            proxyUrl: globalProxy,
          }],
        },
      });
    }

    this.setState({
      interfaceFormLoading: false,
    });
    if (res.success) {
      this.setState({
        interfaceFormVisible: false,
      }, () => {
        this.props.updateInterfaceList();
      });
    }
  }

  deleteInterface = async uniqId => {
    await interfaceService.deleteInterface({ uniqId });
    await this.props.updateInterfaceList();
  }

  downloadInterface = value => {
    location.href = interfaceService.getDownloadAddress({
      uniqId: value.uniqId,
    });
  }

  uploadProps = () => {
    return {
      accept: 'text',
      action: interfaceService.uploadServer,
      showUploadList: false,
      headers: {
        authorization: 'authorization-text',
      },
      onChange (info) {
        if (info.file.status === 'done') {
          if (info.file.response.success) {
            message.success(`${info.file.name} file uploaded successfully`);
            location.reload();
          } else {
            message.error(info.file.response.message);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
  }

  filterInterface = (e) => {
    const filter = e.target.value.toLowerCase();
    this.setState({
      filterString: filter,
    });
  }

  renderInterfaceList = () => {
    const unControlled = this.props.unControlled;
    const formatMessage = this.formatMessage;
    const { interfaceList } = this.props;
    return interfaceList.filter(value =>
      value.pathname.toLowerCase().includes(this.state.filterString) ||
      value.description.toLowerCase().includes(this.state.filterString)
    ).map((value, index) => {
      const isSelected = value.uniqId === this.props.selectedInterface.uniqId;
      const isOpenCompactView = this.props.experimentConfig.isOpenCompactView;

      return (
        <li
          key={index}
          data-accessbilityid={`project-add-api-list-${index}`}
          className={[isSelected ? 'clicked' : '', isOpenCompactView ? 'is-compact-view' : ''].join(' ')}
          onClick={() => this.props.setSelectedInterface(value.uniqId)}
        >
          <div className="interface-item">
            <h3 className="interface-item-title" title={value.pathname}>{value.pathname}</h3>
            <p className="interface-item-desc" title={value.description}>{value.description}</p>
            <p className="interface-item-method">
              <span className="interface-item-method-name">method: </span>
              <span className="interface-item-method-value">{value.method}</span>
            </p>
          </div>
          {!unControlled && <div className="interface-control" style={{fontSize: '16px'}}>
            {this.props.experimentConfig.isOpenDownloadAndUpload ? <span>
              <Upload name={ value.uniqId } {...this.uploadProps()}>
                <Icon className="upload-icon" type="upload" />
              </Upload>
              <Icon
                type="download"
                className="download-icon"
                onClick={() => this.downloadInterface(value)}
              />
            </span> : null}
            <Tooltip title={formatMessage('interfaceList.updateInterface')}>
              <Icon
                type="setting"
                className="setting-icon"
                onClick={() => this.showUpdateForm(value)}
              />
            </Tooltip>
            <Popconfirm
              title={formatMessage('common.deleteTip')}
              onConfirm={() => this.deleteInterface(value.uniqId)}
              okText={formatMessage('common.confirm')}
              cancelText={formatMessage('common.cancel')}
            >
              <Icon style={{color: '#f5222d'}} className="delete-icon" type="delete" />
            </Popconfirm>
          </div>}
        </li>
      );
    });
  }

  render () {
    const formatMessage = this.formatMessage;
    const unControlled = this.props.unControlled;
    const interfaceListClassNames = ['interface-list'];
    if (unControlled) interfaceListClassNames.push('uncontrolled');
    return (
      <div className={`${interfaceListClassNames.join(' ')}`}>
        {!unControlled && <Row className="interface-filter-row">
          <Col span={15}>
            <Search
              data-accessbilityid="project-search-api"
              placeholder={formatMessage('interfaceList.searchInterface')}
              onChange={this.filterInterface}
            />
          </Col>
          <Col span={8} offset={1}>
            <Button
              type="primary"
              data-accessbilityid="project-add-api-list-btn"
              onClick={this.showCreateForm}
            >
              <FormattedMessage id="interfaceList.addInterface" />
            </Button>
          </Col>
        </Row>}

        <ul>
          { this.renderInterfaceList() }
        </ul>

        <InterfaceForm
          visible={this.state.interfaceFormVisible}
          onCancel={this.closeInterfaceForm}
          onOk={this.confirmInterfaceForm}
          confirmLoading={this.state.interfaceFormLoading}
          stageData={this.state.stageData}
        />
      </div>
    );
  }
}

export default injectIntl(InterfaceList);
