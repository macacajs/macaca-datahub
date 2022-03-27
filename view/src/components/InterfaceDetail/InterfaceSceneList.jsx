import React, { Component } from 'react';
import { Input, Button, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Row, Col } from 'react-flexbox-grid';
import { injectIntl, FormattedMessage } from 'react-intl';

import SceneForm from '../forms/SceneForm';
import { sceneService } from '../../service';

const Search = Input.Search;

class InterfaceSceneList extends Component {
  state = {
    sceneFormVisible: false,
    sceneFormLoading: false,
    filterString: '',
    stageData: {},
  };

  formatMessage = (id) => this.props.intl.formatMessage({ id });

  showSceneForm = () => {
    this.setState({
      formType: 'create',
      stageData: {},
      sceneFormVisible: true,
    });
  };

  showUpdateForm = async (value) => {
    this.setState({
      formType: 'update',
      stageData: value,
      sceneFormVisible: true,
    });
  };

  hideSceneForm = () => {
    this.setState({
      sceneFormVisible: false,
    });
  };

  confirmSceneForm = async ({ sceneName, contextConfig, data, format }) => {
    const { uniqId: interfaceUniqId } = this.props.interfaceData;
    this.setState({
      sceneFormLoading: true,
    });
    const apiName = this.state.stageData.uniqId ? 'updateScene' : 'createScene';

    const params = {
      uniqId: this.state.stageData.uniqId,
      interfaceUniqId,
      sceneName,
      contextConfig,
      data,
      format,
    };
    const res = await sceneService[apiName](params);
    this.setState({
      sceneFormLoading: false,
    });
    if (res.success) {
      this.setState(
        {
          sceneFormVisible: false,
        },
        this.postCreate,
      );
    }
  };

  onChangeMode = (value) => {
    const { stageData } = this.state;
    const newData = Object.assign(stageData, { format: value });
    this.setState({
      stageData: newData,
    });
  };

  postCreate = async (value) => {
    await this.props.updateInterFaceAndScene();
  };

  filterScene = (e) => {
    const filter = e.target.value.toLowerCase();
    this.setState({
      filterString: filter,
    });
  };

  defaultColProps = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 3,
  };

  renderSceneList = () => {
    const formatMessage = this.formatMessage;
    const { sceneList, selectedScene, experimentConfig } = this.props;
    const disabled = this.props.disabled;
    const isOpenRunJsMode = experimentConfig && experimentConfig.isOpenRunJsMode;
    return (
      <Row>
        {sceneList
          .filter((value) => {
            return value.sceneName.toLowerCase().includes(this.state.filterString);
          })
          .map((value, index) => {
            const isAvtive = selectedScene.uniqId === value.uniqId;
            const classNames = isAvtive ? ['common-list-item', 'common-list-item-active'] : ['common-list-item'];
            if (disabled) classNames.push('disabled');
            return (
              <Col
                {...this.defaultColProps}
                key={value.uniqId}
                data-accessbilityid={`project-api-scene-list-${index}`}
                disabled={this.props.disabled}
              >
                <div className={classNames.join(' ')}>
                  <div
                    className="common-list-item-name"
                    title={`${formatMessage('sceneList.sceneName')} ${value.sceneName}`}
                    onClick={() => !disabled && this.props.changeSelectedScene(value)}
                  >
                    {value.sceneName}
                  </div>
                  {!disabled && (
                    <div className="common-list-item-operation">
                      <Tooltip title={formatMessage('sceneList.updateScene')}>
                        <EditOutlined onClick={() => this.showUpdateForm(value)} />
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
                  )}
                </div>
              </Col>
            );
          })}
      </Row>
    );
  };

  render() {
    const formatMessage = this.formatMessage;
    const disabled = this.props.disabled;
    const selectedScene = this.props.selectedScene;
    const contextConfig = selectedScene && selectedScene.contextConfig;

    let showResInfo = false;
    if (contextConfig) {
      const { responseDelay, responseStatus, responseHeaders } = contextConfig;
      showResInfo =
        (responseDelay && responseDelay.toString() !== '0') ||
        (responseStatus && responseStatus.toString() !== '200') ||
        (responseHeaders && JSON.stringify(responseHeaders) !== '{}');
    }

    const enablePreviewLink = ['GET', 'ALL'].includes(this.props.interfaceData.method);
    return (
      <section>
        <h1>
          <FormattedMessage id="sceneList.title" />
        </h1>
        {enablePreviewLink ? (
          <a href={this.props.previewLink} target="_blank">
            {formatMessage('interfaceDetail.previewData')}
            {`/${window.context.projectName}/${this.props.interfaceData.pathname}`}
          </a>
        ) : (
          <span>
            {formatMessage('interfaceDetail.previewData')}
            {`/${window.context.projectName}/${this.props.interfaceData.pathname}`}
          </span>
        )}
        {contextConfig && showResInfo ? (
          <div className="res-info">
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
        ) : (
          ''
        )}

        <Row style={{ padding: '4px 0' }}>
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
          </Col>
        </Row>

        <div>
          {disabled ? (
            <FormattedMessage id="sceneList.switchSceneDisabledHint" />
          ) : (
            <FormattedMessage id="sceneList.switchSceneHint" />
          )}
        </div>

        {this.renderSceneList()}

        <SceneForm
          experimentConfig={this.props.experimentConfig}
          visible={this.state.sceneFormVisible}
          onCancel={this.hideSceneForm}
          onOk={this.confirmSceneForm}
          onChangeMode={this.onChangeMode}
          confirmLoading={this.state.sceneFormLoading}
          stageData={this.state.stageData}
        />
      </section>
    );
  }
}

export default injectIntl(InterfaceSceneList);
