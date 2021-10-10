'use strict';

import React from 'react';
import debug from 'debug';
import io from 'socket.io-client';

const logger = debug('datahub:socket.io');

import {
  injectIntl,
} from 'react-intl';

import {
  Affix,
  Alert,
  Layout,
  Tabs,
} from 'antd';

import InterfaceList from '../components/InterfaceList';
import InterfaceDetail from '../components/InterfaceDetail/index';

import RealTime from '../components/RealTime';
import RealTimeDetail from '../components/RealTimeDetail';

import {
  interfaceService,
} from '../service';

import {
  queryParse,
} from '../common/helper';

import './Project.less';

const TabPane = Tabs.TabPane;
const Sider = Layout.Sider;
const Content = Layout.Content;

const realTimeTabSymbol = 'REALTIME_TAB_KEY';
const interfaceTabSymbol = 'INTERFACE_TAB_KEY';

class Project extends React.Component {
  state = {
    interfaceList: [],
    selectedInterface: {},

    subRouter: interfaceTabSymbol,
    REALTIME_MAXLINE: 100,
    realTimeDataList: [],
    realTimeIndex: 0,
    showRightSide: false,
  }

  getIndexByHash (res) {
    const params = queryParse(location.hash);

    if (!res.success) return 0;

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
    this.initRealTimeDataList();

    const res = await this.fetchInterfaceList();
    const index = this.getIndexByHash(res);

    this.setState({
      interfaceList: res.data || [],
      selectedInterface: (res.data && res.data[index]) || {},
    });
  }

  fetchInterfaceList = async () => {
    return await interfaceService.getInterfaceList();
  }

  updateInterfaceList = async () => {
    const res = await this.fetchInterfaceList();
    this.setState({
      interfaceList: res.data || [],
      selectedInterface: this.getSelectedInterface(res.data),
    });
  }

  getSelectedInterface = data => {
    if (!Array.isArray(data)) return {};

    let result = null;

    if (this.state.selectedInterface && this.state.selectedInterface.uniqId) {
      result = data.find(value => {
        return value.uniqId === this.state.selectedInterface.uniqId;
      });
    }
    return result || data[0];
  }

  setSelectedInterface = async (uniqId) => {
    const selectedInterface = this.state.interfaceList.find(i => i.uniqId === uniqId) || {};

    this.setState({
      selectedInterface,
    });

    const hashInfo = `pathname=${encodeURI(selectedInterface.pathname)}&method=${selectedInterface.method}`;

    location.hash = `#/?${hashInfo}`;
  }

  initRealTimeDataList () {
    const host = `//${location.hostname}:${window.context.socket.port}`;
    const socket = io(host);
    socket.on('push data', (data) => {
      logger(data);
      const newData = [
        ...this.state.realTimeDataList,
      ].slice(0, this.state.REALTIME_MAXLINE - 1);
      newData.unshift(data);
      this.setState({
        realTimeDataList: newData,
      });
    });
  }

  tabOnChange = key => {
    this.setState({
      subRouter: key,
    });
  }

  selectRealTimeItem = index => {
    this.setState({
      subRouter: realTimeTabSymbol,
      realTimeIndex: index,
    });
  }

  onDrawerClose = () => {
    this.setState({
      showRightSide: false,
    });
  }

  toggleRightSide = () => {
    this.setState({
      showRightSide: true,
    });
  }

  render () {
    const globalProxyEnabled = this.state.interfaceList.every(item => item.proxyConfig.enabled);

    return (
      <Layout>
        <Sider
          width="300px"
          style={{
            background: 'none',
            borderRight: '1px solid rgba(0,0,0,0.05)',
          }}
          className="project-sider"
        >
          <Affix>
            <Tabs
              defaultActiveKey={interfaceTabSymbol}
              onChange={this.tabOnChange}
              animated={false}
              data-accessbilityid="tabs-container"
            >
              <TabPane
                tab={this.props.intl.formatMessage({
                  id: 'project.interfaceList',
                })}
                key={interfaceTabSymbol}
              >
                <InterfaceList
                  selectedInterface={this.state.selectedInterface}
                  setSelectedInterface={this.setSelectedInterface}
                  experimentConfig={this.props.experimentConfig}
                  interfaceList={this.state.interfaceList}
                  updateInterfaceList={this.updateInterfaceList}
                />
              </TabPane>
              <TabPane
                tab={this.props.intl.formatMessage({
                  id: 'project.realtimeList',
                })}
                key={realTimeTabSymbol}
              >
                <RealTime
                  realTimeDataList={this.state.realTimeDataList}
                  realTimeIndex={this.state.realTimeIndex || 0}
                  onSelect={this.selectRealTimeItem}
                />
              </TabPane>
            </Tabs>
          </Affix>
        </Sider>
        <Content>
          {
            this.state.interfaceList.length
              ? this.state.subRouter === interfaceTabSymbol &&
                <InterfaceDetail
                  experimentConfig={this.props.experimentConfig}
                  selectedInterface={this.state.selectedInterface}
                  updateInterfaceList={this.updateInterfaceList}
                  globalProxyEnabled={globalProxyEnabled}
                  key={this.state.selectedInterface.uniqId}
                />
              : (
                <div className="interface-detail">
                  <Alert
                    className="add-api-hint"
                    message={this.props.intl.formatMessage({
                      id: 'project.createApi',
                    })}
                    type="info"
                    showIcon
                  />
                </div>
              )
          }
          {
            this.state.subRouter === realTimeTabSymbol &&
            <RealTimeDetail
              interfaceList={this.state.interfaceList}
              realTimeData={this.state.realTimeDataList[this.state.realTimeIndex]}
            />
          }
        </Content>
      </Layout>
    );
  }
}

export default injectIntl(Project);
