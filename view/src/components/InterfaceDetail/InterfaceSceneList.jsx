import React, { Component } from 'react';
import { Input, Button, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Row, Col } from 'react-flexbox-grid';
import SceneForm from '../forms/SceneForm';
import { sceneService } from '../../service';

const { Search } = Input;

class InterfaceSceneList extends Component {
  state = {
    sceneFormVisible: false,
    sceneFormLoading: false,
    filterString: '',
    stageData: {},
  };

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
    const { sceneList, selectedScene } = this.props;
    const { disabled } = this.props;
    return (
      <Row>
        {sceneList
          .filter((value) => {
            return value.sceneName.toLowerCase().includes(this.state.filterString);
          })
          .map((value, index) => {
            const isActive = selectedScene.uniqId === value.uniqId;
            const classNames = isActive ? ['common-list-item', 'common-list-item-active'] : ['common-list-item'];
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
                    title={`${__i18n('场景名称')} ${value.sceneName}`}
                    onClick={() => {
                      return !disabled && this.props.changeSelectedScene(value);
                    }}
                  >
                    {value.sceneName}
                  </div>
                  {!disabled && (
                    <div className="common-list-item-operation">
                      <Tooltip title={__i18n('更新场景')}>
                        <EditOutlined
                          onClick={() => {
                            console.log(value);
                            return this.showUpdateForm(value);
                          }}
                        />
                      </Tooltip>
                      <Tooltip title={__i18n('删除场景')}>
                        <Popconfirm
                          placement="right"
                          title={__i18n('确定删除？')}
                          onConfirm={() => {
                            return this.props.deleteScene(value);
                          }}
                          okText={__i18n('确定')}
                          cancelText={__i18n('取消')}
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
    const { disabled } = this.props;
    const { selectedScene } = this.props;
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
          {__i18n('场景管理')}
        </h1>
        {enablePreviewLink ? (
          <a href={this.props.previewLink} target="_blank">
            {__i18n('预览场景数据：')}
            {`/${window.context.projectName}/${this.props.interfaceData.pathname}`}
          </a>
        ) : (
          <span>
            {__i18n('interfaceDetail.previewData')}
            {`/${window.context.projectName}/${this.props.interfaceData.pathname}`}
            &nbsp;&nbsp;
            <Tooltip title={__i18n('仅支持 ALL 和 GET 方法预览')}>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        )}
        {contextConfig && showResInfo ? (
          <div className="res-info">
            <div className="res-header-info">
              <span>{__i18n('响应延迟时间')}：</span>
              <span>{contextConfig.responseDelay}s</span>
            </div>
            <div className="res-header-info">
              <span>{__i18n('响应状态码')}：</span>
              <span>{contextConfig.responseStatus}</span>
            </div>
            <div className="res-header-info">
              <span>{__i18n('响应头数据')}：</span>
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
              placeholder={__i18n('搜索场景')}
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
              {__i18n('新增场景')}
            </Button>
          </Col>
        </Row>

        <div>
          {disabled ? __i18n('如需使用场景数据，请关闭代理模式') : __i18n('点击场景进行切换：')}
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

export default InterfaceSceneList;
