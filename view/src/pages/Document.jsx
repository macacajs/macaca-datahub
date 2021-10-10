'use strict';

import React from 'react';

import {
  FormattedMessage,
} from 'react-intl';

import {
  Tabs,
  Icon,
  Button,
  Layout,
} from 'antd';

import {
  Controlled as CodeMirror,
} from '../common/codemirror';

import {
  queryParse,
  serialize,
} from '../common/helper';

const codeMirrorOptions = {
  theme: 'default',
  mode: 'application/json',
  foldGutter: true,
  lineNumbers: true,
  styleActiveLine: true,
  showTrailingSpace: true,
  scrollbarStyle: 'overlay',
  gutters: [
    'CodeMirror-foldgutter',
  ],
};

const TabPane = Tabs.TabPane;

const projectName = window.context.projectName;

import InterfaceList from '../components/InterfaceList';
import InterfaceSchema from '../components/InterfaceDetail/InterfaceSchema';

import {
  sceneService,
  schemaService,
  interfaceService,
} from '../service';

import './Document.less';

const Sider = Layout.Sider;
const Content = Layout.Content;

class Document extends React.Component {
  state = {
    interfaceList: [],
    selectedInterface: {},
    schemaData: [],
    sceneList: [],
    currentScene: '',
  }

  // 根据 hash 值初始化数据
  getIndexByHash (res) {
    const params = queryParse(location.hash);

    if (!res.success || !res.data) {
      return 0;
    }

    for (let i = 0; i < res.data.length; i++) {
      const item = res.data[i];

      if (item.method === params.method &&
        item.pathname === decodeURI(params.pathname)) {
        return i;
      }
    }

    return 0;
  }

  async componentDidMount () {
    const interfaceRes = await this.initInterfaceList();
    const index = this.getIndexByHash(interfaceRes);
    const selectedInterface = (interfaceRes.data && interfaceRes.data[index]) || {};
    let schemaRes = {};
    let sceneRes = {};
    if (selectedInterface.uniqId) {
      schemaRes = await schemaService.getSchema({ interfaceUniqId: selectedInterface.uniqId });
      sceneRes = await sceneService.getSceneList({ interfaceUniqId: selectedInterface.uniqId });
    }
    this.setState({
      interfaceList: interfaceRes.data || [],
      selectedInterface,
      schemaData: schemaRes.data || [],
      sceneList: sceneRes.data || [],
    });
  }

  initInterfaceList = async () => {
    return await interfaceService.getInterfaceList();
  }

  fetchSchemaAndScene = async (interfaceUniqId) => {
    if (interfaceUniqId) {
      const schemaRes = await schemaService.getSchema({ interfaceUniqId });
      const sceneRes = await sceneService.getSceneList({ interfaceUniqId });
      this.setState({
        schemaData: schemaRes.data || [],
        sceneList: sceneRes.data || [],
      });
    }
  }

  setSelectedInterface = async (uniqId) => {
    const selectedInterface = this.state.interfaceList.find(i => i.uniqId === uniqId) || {};

    this.setState({
      selectedInterface,
    });

    let hashInfo = `pathname=${encodeURI(selectedInterface.pathname)}&method=${selectedInterface.method}`;

    if (selectedInterface.currentScene) {
      hashInfo += `&scene=${encodeURI(selectedInterface.currentScene)}`;
    }
    location.hash = `#/?${hashInfo}`;

    await this.fetchSchemaAndScene(selectedInterface.uniqId);
  }

  toProjectPage = () => {
    location.href = `//${location.host}/project/${projectName}`;
  }

  changeSceneDoc = value => {
    const params = queryParse(location.hash);
    params.scene = value;
    location.hash = `#/?${serialize(params)}`;

    this.setState({
      currentScene: value,
    });
  }

  render () {
    const params = queryParse(location.hash);
    const sceneList = this.state.sceneList;
    const sceneData = sceneList.find(item => item.sceneName === params.scene);
    let currentScene = this.state.currentScene;

    if (sceneData && sceneData.sceneName) {
      currentScene = sceneData.sceneName;
    } else {
      currentScene = sceneList[0] && sceneList[0].sceneName;
    }

    return (
      <Layout>
        <Sider width={300} style={{
          minHeight: '600px',
          background: '#fff',
          borderRight: '1px solid rgba(0,0,0,0.05)',
        }}>
          <InterfaceList
            unControlled={true}
            selectedInterface={this.state.selectedInterface}
            setSelectedInterface={this.setSelectedInterface}
            experimentConfig={this.props.experimentConfig}
            interfaceList={this.state.interfaceList}
          />
        </Sider>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <Button
            className="scene-doc-button"
            onClick={this.toProjectPage}
          >
            <Icon type="setting"/>
            <FormattedMessage id="topNav.projectConfig"/>
          </Button>
          <h2>{
            this.state.selectedInterface.method
              ? `${this.state.selectedInterface.method} / ${this.state.selectedInterface.pathname}`
              : '-'
          }</h2>
          <h3 style={{color: 'gray'}}>{ this.state.selectedInterface.description || '-'}</h3>
          <InterfaceSchema
            unControlled={true}
            schemaData={this.state.schemaData}
          />
          <section>
            <h1 style={{marginTop: '20px'}}><FormattedMessage id="sceneList.sceneData"/></h1>
            <Tabs
              onChange={this.changeSceneDoc}
              animated={false}
              activeKey={currentScene}
            >
              {
                sceneList.map((sceneData, index) =>
                  <TabPane
                    size="small"
                    tab={sceneData.sceneName}
                    key={sceneData.sceneName}
                  >
                    <CodeMirror
                      value={JSON.stringify(sceneData.data, null, 2)}
                      options={codeMirrorOptions}
                    />
                  </TabPane>
                )
              }
            </Tabs>
          </section>
        </Content>
      </Layout>
    );
  }
}

export default Document;
