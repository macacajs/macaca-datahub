'use strict';

import React, {
  Component,
} from 'react';

import {
  Row,
  Col,
  Input,
  Upload,
  message,
  Tooltip,
  Popconfirm,
  Popover,
  Collapse,
} from 'antd';

const { Panel } = Collapse;

import {
  DeleteOutlined,
  SettingOutlined,
  UploadOutlined,
  DownloadOutlined,
  CaretRightOutlined,
  EditOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import InterfaceForm from './forms/InterfaceForm';
import GroupForm from './forms/GroupForm';

import { interfaceService, groupService } from '../service';

import './InterfaceList.less';
import './InterfaceList.module.less';

const Search = Input.Search;

const globalProxy = window.context && window.context.globalProxy;

const { uniqId: projectUniqId } = window.context || {};

class InterfaceList extends Component {
  state = {
    interfaceFormVisible: false,
    interfaceFormLoading: false,
    groupFormVisible: false,
    groupFormLoading: false,
    filterString: '',
    stageData: null,
    addInterfaceInputIsVisible: false,
    editGroupNameIndex: -1, // 编辑态分组索引，默认 -1
  }

  componentDidMount = () => {
    this.groupInputRefs = [];
  }

  componentDidUpdate = () => {
    if (this.state.addInterfaceInputIsVisible) {
      this.input.focus();
    }
    if (this.state.editGroupNameIndex !== -1) {
      this.groupInputRefs[this.state.editGroupNameIndex].focus(); // 编辑态输入框获取焦点
    }
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  showGroupForm = () => {
    this.setState({
      groupFormVisible: true,
    });
  }

  hideGroupForm = () => {
    this.setState({
      groupFormVisible: false,
    });
  }

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

  confirmGroupForm = async ({ groupName }) => {
    this.setState({
      groupFormLoading: true,
    });

    const res = await groupService.createGroup({
      belongedUniqId: projectUniqId,
      groupName,
      groupType: 'Interface',
    });

    this.setState({
      groupFormLoading: false,
    });

    if (res.success) {
      this.setState({
        groupFormVisible: false,
      }, this.props.updateInterfaceList);
    }
  }

  updateGroupName = async ({ uniqId, groupNameNew }) => {
    if (!groupNameNew) {
      this.setState({
        editGroupNameIndex: -1,
      });
      return;
    }
    const res = await groupService.updateGroupName({
      uniqId,
      groupName: groupNameNew,
    });

    if (res.success) {
      this.setState({
        editGroupNameIndex: -1,
      });
      this.props.updateInterfaceList();
    }
  }

  confirmInterfaceForm = async ({ pathname, description, method, groupUniqId }) => {
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
      groupUniqId,
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

  deleteInterfaceGroup = async (value) => {
    if (value.interfaceList.length !== 0) {
      message.warn(this.formatMessage('group.deleteInterfaceGroupWarning'));
      return;
    }

    const res = await groupService.deleteGroup({
      uniqId: value.groupUniqId,
    });
    if (res) {
      message.success(this.formatMessage('group.deleteGroupSuccess'));
    }
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
    const { interfaceGroupList } = this.props;

    return (
      <Collapse
        defaultActiveKey={['0']}
        ghost
        expandIconPosition="left"
        className="interface-group-collapse"
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        {
          interfaceGroupList.map((interfaceGroup, index) => {
            return (
              <Panel
                className="interface-group-collapse-panel"
                header={
                  this.state.editGroupNameIndex === index ? (
                    <Input
                      style={{ width: '70%' }}
                      defaultValue={interfaceGroup.groupName}
                      ref={(groupInputRef) => { this.groupInputRefs[index] = groupInputRef; }}
                      onBlur={(e) => {
                        this.updateGroupName({
                          uniqId: interfaceGroup.groupUniqId,
                          groupNameNew: e.target.value,
                        });
                      }}
                      onPressEnter={(e) => {
                        this.updateGroupName({
                          uniqId: interfaceGroup.groupUniqId,
                          groupNameNew: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    <span>{interfaceGroup.groupName}</span>
                  )
                }
                key={index}
                extra={
                  !unControlled ? (
                    <span
                      className="interface-group-control"
                      onClick={e => e.stopPropagation()}
                    >
                      <EditOutlined
                        className="interface-group-control-edit"
                        onClick={() => {
                          this.setState({ editGroupNameIndex: index });
                        }}
                      />
                      <Popconfirm
                        placement="right"
                        title={formatMessage('common.deleteTip')}
                        onConfirm={() => this.deleteInterfaceGroup(interfaceGroup)}
                        okText={formatMessage('common.confirm')}
                        cancelText={formatMessage('common.cancel')}
                      >
                        <DeleteOutlined style={{ color: '#f5222d' }} />
                      </Popconfirm>
                    </span>) : (
                    <span />
                  )
                }
              >
                <ul>
                  {
                    interfaceGroup.interfaceList.filter(value =>
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
                                <UploadOutlined className="upload-icon" />
                              </Upload>
                              <DownloadOutlined
                                className="download-icon"
                                onClick={() => this.downloadInterface(value)}
                              />
                            </span> : null}
                            <Tooltip title={formatMessage('interfaceList.updateInterface')}>
                              <SettingOutlined
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
                              <DeleteOutlined style={{color: '#f5222d'}} className="delete-icon" />
                            </Popconfirm>
                          </div>}
                        </li>
                      );
                    })
                  }
                </ul>
              </Panel>
            );
          })
        }
      </Collapse>
    );
  }

  render () {
    const formatMessage = this.formatMessage;
    const unControlled = this.props.unControlled;
    const interfaceListClassNames = ['interface-list'];
    if (unControlled) interfaceListClassNames.push('uncontrolled');
    return (
      <div className={`${interfaceListClassNames.join(' ')}`}>
        {!unControlled && <Row className="interface-filter-row">
          <Col span={20}>
            <Search
              data-accessbilityid="project-search-api"
              placeholder={formatMessage('interfaceList.searchInterface')}
              onChange={this.filterInterface}
            />
          </Col>
          <Col span={3} offset={1} className="add-button">
            <Popover
              overlayClassName="popover-content"
              content={
                <ul className="add-item">
                  <li onClick={this.showCreateForm}>
                    <FormattedMessage id="interfaceList.addInterface" />
                  </li>
                  <li onClick={this.showGroupForm}>
                    <FormattedMessage id="group.create" />
                  </li>
                </ul>
              }
              placement="bottom"
            >
              <PlusCircleFilled
                className="add-btn"
                data-accessbilityid="project-add-api-list-btn"
              />
            </Popover>
          </Col>
        </Row>}

        { this.renderInterfaceList() }

        <InterfaceForm
          visible={this.state.interfaceFormVisible}
          onCancel={this.closeInterfaceForm}
          onOk={this.confirmInterfaceForm}
          confirmLoading={this.state.interfaceFormLoading}
          stageData={this.state.stageData}
          groupList={this.props.groupList}
        />

        <GroupForm
          visible={this.state.groupFormVisible}
          onCancel={this.hideGroupForm}
          onOk={this.confirmGroupForm}
          confirmLoading={this.state.groupFormLoading}
        />
      </div>
    );
  }
}

export default injectIntl(InterfaceList);
