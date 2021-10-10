'use strict';

import React from 'react';

import {
  FormattedMessage,
} from 'react-intl';

import {
  Icon,
  Button,
  Breadcrumb,
} from 'antd';

import InterfaceSceneList from './InterfaceSceneList';
import InterfaceProxyConfig from './InterfaceProxyConfig';
import InterfaceSchema from './InterfaceSchema';
import deepMerge from 'deepmerge';

import './index.less';

const projectName = window.context.projectName;

import {
  sceneService,
  schemaService,
  interfaceService,
} from '../../service';

import {
  queryParse,
  serialize,
  jsonToSchema,
} from '../../common/helper';

class InterfaceDetail extends React.Component {
  state = {
    selectedScene: {},
    sceneList: [],
    schemaData: [],
  }

  componentWillMount () {
    this.fetchSceneList();
  }

  updateSceneFetch = async (scene) => {
    await interfaceService.updateInterface({
      uniqId: this.props.selectedInterface.uniqId,
      currentScene: scene,
    });
  }

  changeSelectedScene = async (value) => {
    const params = queryParse(location.hash);
    location.hash = `#/?${serialize(params)}`;

    await this.updateSceneFetch(value.sceneName);

    const selectedScene = this.state.sceneList.filter(i => i.sceneName === value.sceneName)[0];
    this.setState({
      selectedScene,
    });
  }

  fetchSceneList = async () => {
    const res = await sceneService.getSceneList({ interfaceUniqId: this.props.selectedInterface.uniqId });
    this.setState({
      sceneList: res.data || [],
      selectedScene: res.data && this.getDefaultScene(res.data),
    });
    this.fetchSchema();
  }

  getInitResSchema = (sceneData, schemaData) => {
    let resIndex = -1;
    schemaData.forEach((item, index) => {
      if (item.type === 'response') {
        resIndex = index;
      }
    });

    if (!sceneData || !sceneData.length) {
      return;
    }

    const obj = sceneData.length > 1 ? deepMerge.all(sceneData) : sceneData[0];
    const schema = jsonToSchema(obj);
    const result = {
      type: 'response',
      data: {
        enableSchemaValidate: true,
        schemaData: schema,
      },
    };

    if (resIndex === -1) {
      schemaData.push(result);
    } else {
      schemaData[resIndex] = deepMerge(result, schemaData[resIndex]);
    }
  }

  fetchSchema = async () => {
    const sceneData = this.state.sceneList
      .filter(item => item.format === 'json')
      .map(item => item.data);
    const res = await schemaService.getSchema({ interfaceUniqId: this.props.selectedInterface.uniqId });
    const schemaData = res.data || [];

    this.getInitResSchema(sceneData, schemaData);

    this.setState({
      schemaData,
    });
  }

  getDefaultScene = data => {
    if (!Array.isArray(data)) return {};
    const params = queryParse(location.hash);

    if (params.scene) {
      const result = data.find(item => item.sceneName === params.scene);

      if (result) {
        // 若参数与当前场景不同，需要更新场景
        if (params.scene !== this.props.selectedInterface.currentScene) {
          this.updateSceneFetch(params.scene);
        }
        return result;
      }
    }

    return data.find(value => {
      return value.sceneName === this.props.selectedInterface.currentScene;
    }) || {};
  }

  deleteScene = async (value) => {
    await sceneService.deleteScene({
      uniqId: value.uniqId,
    });
    await this.updateInterFaceAndScene();
  }

  updateInterFaceAndScene = async () => {
    await this.props.updateInterfaceList();
    await this.fetchSceneList();
  }

  toggleProxy = async () => {
    const { enabled = false } = this.props.selectedInterface.proxyConfig;
    const flag = !enabled;
    const selectedInterface = this.props.selectedInterface;
    await interfaceService.updateInterface({
      uniqId: this.props.selectedInterface.uniqId,
      proxyConfig: {
        ...selectedInterface.proxyConfig,
        enabled: flag,
      },
    });
    await this.props.updateInterfaceList();
  }

  toggleGlobalProxy = async () => {
    const enabled = !this.props.globalProxyEnabled;
    await interfaceService.updateAllProxy({
      projectUniqId: window.context.uniqId,
      enabled,
    });
    await this.props.updateInterfaceList();
  }

  changeProxyList = async newList => {
    const selectedInterface = this.props.selectedInterface;
    const payload = {
      uniqId: selectedInterface.uniqId,
      proxyConfig: {
        ...selectedInterface.proxyConfig,
        proxyList: newList,
      },
    };
    await interfaceService.updateInterface(payload);
    await this.props.updateInterfaceList();
  }

  deleteProxy = async index => {
    const selectedInterface = this.props.selectedInterface;
    const { proxyList = [] } = selectedInterface.proxyConfig;
    proxyList.splice(index, 1);
    await this.changeProxyList(proxyList);
  }

  addProxy = async value => {
    const selectedInterface = this.props.selectedInterface;
    const { proxyList = [] } = selectedInterface.proxyConfig;
    proxyList.push(value);
    await this.changeProxyList(proxyList);
  }

  selectProxy = async index => {
    const selectedInterface = this.props.selectedInterface;
    await interfaceService.updateInterface({
      uniqId: selectedInterface.uniqId,
      proxyConfig: {
        ...selectedInterface.proxyConfig,
        activeIndex: index,
      },
    });
    await this.props.updateInterfaceList();
  }

  toggleValidation = async (type, value) => {
    const selectedInterface = this.props.selectedInterface;
    const res = await schemaService.updateSchema({
      interfaceUniqId: selectedInterface.uniqId,
      type,
      enableSchemaValidate: value,
    });
    await this.fetchSchema();
    return res;
  }

  updateSchemaData = async ({ type, data }) => {
    const selectedInterface = this.props.selectedInterface;
    const res = await schemaService.updateSchema({
      interfaceUniqId: selectedInterface.uniqId,
      type,
      schemaData: data,
    });
    await this.fetchSchema();
    return res;
  }

  toDocPage = () => {
    location.href = `//${location.host}/doc/${projectName}`;
  }

  render () {
    const { selectedInterface } = this.props;
    const previewLink = `//${location.host}/data/${projectName}/${this.props.selectedInterface.pathname}`;
    return (
      <div className="interface-detail">
        <div className="interface-detail-navigation">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/dashboard"><FormattedMessage id="topNav.allProject" /></a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {window.context && window.context.projectName}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FormattedMessage id="topNav.projectConfig" />
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="interface-detail-content">
          <Button
            type="primary"
            className="scene-doc-button"
            onClick={this.toDocPage}
          >
            <Icon type="book"/>
            <FormattedMessage id="topNav.documentation"/>
          </Button>
          <InterfaceSceneList
            experimentConfig={this.props.experimentConfig}
            disabled={selectedInterface.proxyConfig.enabled}
            previewLink={previewLink}
            sceneList={this.state.sceneList}
            selectedScene={this.state.selectedScene}
            interfaceData={selectedInterface}
            deleteScene={this.deleteScene}
            changeSelectedScene={this.changeSelectedScene}
            updateInterFaceAndScene={this.updateInterFaceAndScene}
          />
          <InterfaceProxyConfig
            proxyConfig={this.props.selectedInterface.proxyConfig}
            selectedInterface={this.props.selectedInterface}
            globalProxyEnabled={this.props.globalProxyEnabled}
            toggleProxy={this.toggleProxy}
            toggleGlobalProxy={this.toggleGlobalProxy}
            deleteProxy={this.deleteProxy}
            addProxy={this.addProxy}
            selectProxy={this.selectProxy}
          />
          <InterfaceSchema
            toggleValidation={this.toggleValidation}
            schemaData={this.state.schemaData}
            updateSchemaData={this.updateSchemaData}
          />
        </div>
      </div>
    );
  }
}

export default InterfaceDetail;
