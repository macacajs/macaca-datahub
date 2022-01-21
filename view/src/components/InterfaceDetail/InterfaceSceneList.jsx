import React, { Component } from 'react';
import {
  Input,
  Button,
  Tooltip,
  Popconfirm,
  Collapse,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { Row, Col } from 'react-flexbox-grid';
import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import SceneForm from '../forms/SceneForm';
import GroupForm from '../forms/GroupForm';
import { sceneService, groupService } from '../../service';

const Search = Input.Search;
const { Panel } = Collapse;

class InterfaceSceneList extends Component {
  state = {
    sceneFormVisible: false,
    sceneFormLoading: false,
    groupFormVisible: false,
    groupFormLoading: false,
    filterString: '',
    stageData: {},
    activeKeyArray: [],
    editGroupNameIndex: -1, // 编辑态分组索引，默认 -1
  }

  componentDidMount = () => {
    this.groupInputRefs = [];
  }

  componentDidUpdate = () => {
    if (this.state.editGroupNameIndex !== -1) {
      this.groupInputRefs[this.state.editGroupNameIndex].focus();
    }
  }

  formatMessage = id => this.props.intl.formatMessage({ id })

  showSceneForm = () => {
    this.setState({
      formType: 'create',
      stageData: {},
      sceneFormVisible: true,
    });
  }

  showGroupForm = () => {
    this.setState({
      groupFormVisible: true,
    });
  }

  showUpdateForm = async value => {
    this.setState({
      formType: 'update',
      stageData: value,
      sceneFormVisible: true,
    });
  }

  hideSceneForm = () => {
    this.setState({
      sceneFormVisible: false,
    });
  }

  hideGroupForm = () => {
    this.setState({
      groupFormVisible: false,
    });
  }

  confirmSceneForm = async ({ sceneName, groupUniqId, contextConfig, data, format }) => {
    const { uniqId: interfaceUniqId } = this.props.interfaceData;
    this.setState({
      sceneFormLoading: true,
    });
    const apiName = this.state.stageData.uniqId
      ? 'updateScene'
      : 'createScene';

    const params = {
      uniqId: this.state.stageData.uniqId,
      interfaceUniqId,
      sceneName,
      groupUniqId,
      contextConfig,
      data,
      format,
    };
    const res = await sceneService[apiName](params);
    this.setState({
      sceneFormLoading: false,
    });
    if (res.success) {
      this.setState({
        sceneFormVisible: false,
      }, this.postCreate);
    }
  }

  confirmGroupForm = async ({ groupName }) => {
    const { uniqId: interfaceUniqId } = this.props.interfaceData;
    this.setState({
      groupFormLoading: true,
    });

    const params = {
      belongedUniqId: interfaceUniqId,
      groupName,
      groupType: 'Scene',
    };
    const res = await groupService.createGroup(params);
    this.setState({
      groupFormLoading: false,
    });
    if (res.success) {
      this.setState({
        groupFormVisible: false,
      }, this.postCreate);
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
      this.props.updateInterFaceAndScene();
    }
  }

  onChangeMode = (value) => {
    const { stageData } = this.state;
    const newData = Object.assign(stageData, { format: value });
    this.setState({
      stageData: newData,
    });
  }

  postCreate = async value => {
    await this.props.updateInterFaceAndScene();
  }

  filterScene = (e) => {
    const filter = e.target.value.toLowerCase();
    this.setState({
      filterString: filter,
    });
  }

  defaultColProps = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 3,
  }

  renderSceneGroupList = () => {
    const formatMessage = this.formatMessage;
    const { sceneGroupList, selectedScene } = this.props;
    const disabled = this.props.disabled;
    return (
      <Collapse
        defaultActiveKey={['0', '1']}
        className="scene-group-collapse"
        ghost
        expandIconPosition="left"
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        {
          sceneGroupList.map((value, index) => {
            return (
              <Panel
                className="scene-group-collapse-panel"
                header={
                  this.state.editGroupNameIndex === index ? (
                    <Input
                      defaultValue={value.groupName}
                      ref={(groupInputRef) => { this.groupInputRefs[index] = groupInputRef; }}
                      onBlur={(e) => {
                        this.updateGroupName({
                          uniqId: value.groupUniqId,
                          groupNameNew: e.target.value,
                        });
                      }}
                      onPressEnter={(e) => {
                        this.updateGroupName({
                          uniqId: value.groupUniqId,
                          groupNameNew: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    <span>{value.groupName}</span>
                  )
                }
                collapsible="header"
                key={index}
                extra={
                  <span className="scene-group-control">
                    <EditOutlined onClick={() => { this.setState({ editGroupNameIndex: index }); }} style={{ marginRight: '4px' }} />
                    <Popconfirm
                      title={formatMessage('common.deleteTip')}
                      onConfirm={() => this.props.deleteSceneGroup(value)}
                      okText={formatMessage('common.confirm')}
                      cancelText={formatMessage('common.cancel')}
                    >
                      <DeleteOutlined style={{color: '#f5222d'}} className="delete-icon" />
                    </Popconfirm>
                  </span>
                }
              >
                <Row>
                  {
                    value.sceneList.filter(value => {
                      return value.sceneName.toLowerCase().includes(this.state.filterString);
                    }).map((value, index) => {
                      const isAvtive = selectedScene.uniqId === value.uniqId;
                      const classNames = isAvtive ? [
                        'common-list-item',
                        'common-list-item-active',
                      ] : [ 'common-list-item' ];
                      if (disabled) classNames.push('disabled');
                      return <Col
                        {...this.defaultColProps}
                        key={value.uniqId}
                        data-accessbilityid={`project-api-scene-list-${index}`}
                        disabled={this.props.disabled}
                      >
                        <div className={classNames.join(' ')}>
                          <div className="common-list-item-name"
                            title={`${formatMessage('sceneList.sceneName')} ${value.sceneName}`}
                            onClick={() => !disabled && this.props.changeSelectedScene(value)}
                          >
                            {value.sceneName}
                          </div>
                          {
                            !disabled && <div className="common-list-item-operation">
                              <Tooltip title={formatMessage('sceneList.updateScene')}>
                                <EditOutlined
                                  onClick={() => this.showUpdateForm(value)}
                                />
                              </Tooltip>
                              <Tooltip title={this.formatMessage('sceneList.deleteScene')}>
                                <Popconfirm
                                  placement="right"
                                  title={formatMessage('common.deleteTip')}
                                  onConfirm={() => this.props.deleteScene(value)}
                                  okText={formatMessage('common.confirm')}
                                  cancelText={formatMessage('common.cancel')}
                                >
                                  <DeleteOutlined />
                                </Popconfirm>
                              </Tooltip>
                            </div>
                          }
                        </div>
                      </Col>;
                    })
                  }
                </Row>
              </Panel>
            );
          })
        }
      </Collapse>
    );
  }

  render () {
    const formatMessage = this.formatMessage;
    const disabled = this.props.disabled;
    const selectedScene = this.props.selectedScene;
    const contextConfig = selectedScene && selectedScene.contextConfig;

    let showResInfo = false;
    if (contextConfig) {
      const {
        responseDelay,
        responseStatus,
        responseHeaders,
      } = contextConfig;
      showResInfo = responseDelay && responseDelay.toString() !== '0' || responseStatus && responseStatus.toString() !== '200' || responseHeaders && JSON.stringify(responseHeaders) !== '{}';
    }

    const enablePreviewLink = ['GET', 'ALL'].includes(this.props.interfaceData.method);
    return (
      <section>
        <h1>
          <FormattedMessage id='sceneList.title' />
        </h1>
        {
          enablePreviewLink ? (
            <a href={this.props.previewLink} target="_blank">
              {formatMessage('interfaceDetail.previewData')}{`/${window.context.projectName}/${this.props.interfaceData.pathname}`}
            </a>
          ) : (
            <span>
              {formatMessage('interfaceDetail.previewData')}{`/${window.context.projectName}/${this.props.interfaceData.pathname}`}
            </span>
          )
        }
        {contextConfig && showResInfo
          ? <div className="res-info">
            <div className="res-header-info">
              <span>{formatMessage('sceneList.responseDelayShowInfo')}：</span>
              <span>{contextConfig.responseDelay}s</span>
            </div>
            <div className="res-header-info">
              <span>{formatMessage('sceneList.responseStatusShowInfo')}：</span>
              <span>{contextConfig.responseStatus}</span>
            </div>
            <div className="res-header-info">
              <span>{formatMessage('sceneList.responseDataShowInfo')}：</span>
              <span>{JSON.stringify(contextConfig.responseHeaders)}</span>
            </div>
          </div>
          : ''}

        <Row style={{padding: '4px 0'}}>
          <Col {...this.defaultColProps}>
            <Search
              disabled={disabled}
              placeholder={formatMessage('sceneList.searchScene')}
              onChange={this.filterScene}
            />
          </Col>
          <Col {...this.defaultColProps}>
            <Button
              disabled={disabled}
              type="primary"
              data-accessbilityid="project-api-scene-add-btn"
              onClick={this.showSceneForm}
            >
              <PlusCircleOutlined />
              {formatMessage('sceneList.createScene')}
            </Button>
            &nbsp;&nbsp;
            <Button
              disabled={disabled}
              type="primary"
              data-accessbilityid="project-api-scene-group-add-btn"
              onClick={this.showGroupForm}
            >
              <PlusCircleOutlined />
              {formatMessage('sceneList.createSceneGroup')}
            </Button>
          </Col>
        </Row>

        <div>
          { disabled
            ? <FormattedMessage id='sceneList.switchSceneDisabledHint'/>
            : <FormattedMessage id='sceneList.switchSceneHint'/> }
        </div>

        { this.renderSceneGroupList() }

        <SceneForm
          experimentConfig={this.props.experimentConfig}
          visible={this.state.sceneFormVisible}
          onCancel={this.hideSceneForm}
          onOk={this.confirmSceneForm}
          onChangeMode={this.onChangeMode}
          confirmLoading={this.state.sceneFormLoading}
          stageData={this.state.stageData}
          groupList={this.props.groupList}
        />

        <GroupForm
          visible={this.state.groupFormVisible}
          onCancel={this.hideGroupForm}
          onOk={this.confirmGroupForm}
          confirmLoading={this.state.groupFormLoading}
        />
      </section>
    );
  }
}

export default injectIntl(InterfaceSceneList);
