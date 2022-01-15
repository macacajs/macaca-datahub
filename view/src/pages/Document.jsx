'use strict';

import React from 'react';

import {
  FormattedMessage,
} from 'react-intl';

import {
  Tabs,
  Button,
  Layout,
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';

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
  groupService,
} from '../service';

import './Document.less';

const Sider = Layout.Sider;
const Content = Layout.Content;

const { uniqId: projectUniqId } = window.context || {};

class Document extends React.Component {
  state = {
    interfaceList: [],
    interfaceGroupList: [],
    selectedInterface: {},
    schemaData: [],
    sceneList: [],
    sceneGroupList: [],
    currentScene: {},
    groupList: [],
  }

  // Initialize data based on hash value
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

  getDefaultSelectedInterface (interfaceGroupList) {
    if (!interfaceGroupList.length) return {};

    const interfaceGroup = interfaceGroupList.find(item => !!item.interfaceList.length);

    return interfaceGroup ? interfaceGroup.interfaceList[0] : {};
  }

  async componentDidMount () {
    await this.fetchGroupList();
    const interfaceRes = await this.initInterfaceList();
    // const index = this.getIndexByHash(interfaceRes);
    const selectedInterface = this.getDefaultSelectedInterface(interfaceRes.data.interfaceGroupList) || {};
    let schemaRes = {};
    let sceneRes = {};
    if (selectedInterface.uniqId) {
      schemaRes = await schemaService.getSchema({ interfaceUniqId: selectedInterface.uniqId });
      sceneRes = await sceneService.getSceneList({ interfaceUniqId: selectedInterface.uniqId });
    }
    this.setState({
      interfaceList: interfaceRes.data.interfaceList || [],
      interfaceGroupList: interfaceRes.data.interfaceGroupList || [],
      selectedInterface,
      schemaData: schemaRes.data || [],
      sceneList: sceneRes.data.sceneList || [],
      sceneGroupList: sceneRes.data.sceneGroupList || [],
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
        sceneList: sceneRes.data.sceneList || [],
        sceneGroupList: sceneRes.data.sceneGroupList || [],
      });
    }
  }

  fetchGroupList = async () => {
    const res = await groupService.getGroupList({
      belongedUniqId: projectUniqId,
      groupType: 'Interface',
    });
    this.setState({
      groupList: res.data || [],
    });
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
    const scene = this.state.sceneList.find(item => item.uniqId === value);
    const params = queryParse(location.hash);
    params.scene = scene.sceneName;
    location.hash = `#/?${serialize(params)}`;

    this.setState({
      currentScene: scene,
    });
  }

  changeSceneGroup = value => {
    const sceneGroup = this.state.sceneGroupList.find(item => item.groupUniqId === value);
    const params = queryParse(location.hash);
    params.scene_group = sceneGroup.groupName;
    params.scene = null;
    if (sceneGroup.sceneList.length) {
      params.scene = sceneGroup.sceneList[0].sceneName;
      this.setState({
        currentScene: sceneGroup.sceneList[0],
      });
    } else {
      this.setState({
        currentScene: {},
      });
    }
    location.hash = `#/?${serialize(params)}`;
  }

  render () {
    const params = queryParse(location.hash);
    const sceneList = this.state.sceneList;
    const sceneGroupList = this.state.sceneGroupList;
    const sceneData = sceneList.find(item => item.sceneName === params.scene);
    const sceneGroupData = sceneGroupList.find(item => item.groupName === params.scene_group);
    let currentScene = this.state.currentScene;

    if (sceneData) {
      currentScene = sceneData;
    } else {
      if (sceneGroupData) {
        currentScene = {
          groupUniqId: sceneGroupData && sceneGroupData.groupUniqId,
        };
      } else {
        currentScene = (sceneGroupList[0] && sceneGroupList[0].sceneList[0] && sceneGroupList[0].sceneList[0]) || {};
      }
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
            interfaceGroupList={this.state.interfaceGroupList}
            groupList={this.state.groupList}
          />
        </Sider>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <Button
            className="scene-doc-button"
            onClick={this.toProjectPage}
          >
            <SettingOutlined />
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
              onChange={this.changeSceneGroup}
              animated={false}
              activeKey={currentScene.groupUniqId}
            >
              {
                this.state.sceneGroupList.map((sceneGroupData, index) =>
                  <TabPane
                    size="large"
                    tab={sceneGroupData.groupName}
                    key={sceneGroupData.groupUniqId}
                  >
                    <Tabs
                      onChange={this.changeSceneDoc}
                      animated={false}
                      activeKey={currentScene.uniqId}
                    >
                      {
                        sceneGroupData.sceneList.map((sceneData, index) =>
                          <TabPane
                            size="small"
                            tab={sceneData.sceneName}
                            key={sceneData.uniqId}
                          >
                            <CodeMirror
                              value={JSON.stringify(sceneData.data, null, 2)}
                              options={codeMirrorOptions}
                            />
                          </TabPane>
                        )
                      }
                    </Tabs>
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
