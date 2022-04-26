import React from 'react';
import debug from 'debug';
import io from 'socket.io-client';

import { injectIntl } from 'react-intl';

import { Affix, Layout, Tabs, Empty } from 'antd';

import InterfaceList from '../components/InterfaceList';
import InterfaceDetail from '../components/InterfaceDetail/index';

import RealTime from '../components/RealTime';
import RealTimeDetail from '../components/RealTimeDetail';
import Icon from '../components/Icon';

import { interfaceService, groupService } from '../service';

import './Project.less';
import './Project.module.less';

const logger = debug('datahub:socket.io');

const { TabPane } = Tabs;
const { Sider } = Layout;
const { Content } = Layout;

const realTimeTabSymbol = 'REALTIME_TAB_KEY';
const interfaceTabSymbol = 'INTERFACE_TAB_KEY';

const { uniqId: projectUniqId } = window.context || {};

class Project extends React.Component {
  state = {
    interfaceList: [],
    interfaceGroupList: [], // 接口分组数据
    selectedInterface: {},
    groupList: [],
    subRouter: interfaceTabSymbol,
    REALTIME_MAX_LINE: 100,
    realTimeDataList: [],
    realTimeIndex: 0,
    showRightSide: false,
  };

  getDefaultSelectedInterface(interfaceGroupList) {
    if (!interfaceGroupList.length) return {};

    const interfaceGroup = interfaceGroupList.find((item) => {
      return !!item.interfaceList.length;
    });

    return interfaceGroup ? interfaceGroup.interfaceList[0] : {};
  }

  async componentDidMount() {
    this.initRealTimeDataList();

    const groupListData = await this.fetchGroupList();
    const res = await this.fetchInterfaceList();
    const defaultSelectedInterface = this.getDefaultSelectedInterface(res.data.interfaceGroupList);

    this.setState({
      interfaceList: res.data.interfaceList || [],
      interfaceGroupList: res.data.interfaceGroupList || [],
      selectedInterface: defaultSelectedInterface || {},
      groupList: groupListData.data || [],
    });
  }

  fetchInterfaceList = async () => {
    return await interfaceService.getInterfaceList();
  };

  fetchGroupList = async () => {
    return await groupService.getGroupList({
      belongedUniqId: projectUniqId,
      groupType: 'Interface',
    });
  };

  updateInterfaceList = async () => {
    const groupListData = await this.fetchGroupList();
    const res = await this.fetchInterfaceList();
    this.setState({
      interfaceList: res.data.interfaceList || [],
      interfaceGroupList: res.data.interfaceGroupList || [],
      selectedInterface: this.getSelectedInterface(res.data),
      groupList: groupListData.data || [],
    });
  };

  getSelectedInterface = (data) => {
    if (!Array.isArray(data.interfaceList)) return {};

    let result = null;

    if (this.state.selectedInterface && this.state.selectedInterface.uniqId) {
      result = data.interfaceList.find((value) => {
        return value.uniqId === this.state.selectedInterface.uniqId;
      });
    }

    if (!result) {
      result = this.getDefaultSelectedInterface(data.interfaceGroupList);
    }

    return result;
  };

  setSelectedInterface = async (uniqId) => {
    const selectedInterface =
      this.state.interfaceList.find((i) => {
        return i.uniqId === uniqId;
      }) || {};

    this.setState({
      selectedInterface,
    });

    const hashInfo = `pathname=${encodeURI(selectedInterface.pathname)}&method=${selectedInterface.method}`;

    location.hash = `#/?${hashInfo}`;
  };

  initRealTimeDataList() {
    const host = `//${location.hostname}:${window.context.socket.port}`;
    const socket = io(host);
    socket.on('push data', (data) => {
      logger(data);
      const newData = [...this.state.realTimeDataList].slice(0, this.state.REALTIME_MAX_LINE - 1);
      newData.unshift(data);
      this.setState({
        realTimeDataList: newData,
      });
    });
  }

  tabOnChange = (key) => {
    this.setState({
      subRouter: key,
    });
  };

  selectRealTimeItem = (index) => {
    this.setState({
      subRouter: realTimeTabSymbol,
      realTimeIndex: index,
    });
  };

  onDrawerClose = () => {
    this.setState({
      showRightSide: false,
    });
  };

  toggleRightSide = () => {
    this.setState({
      showRightSide: true,
    });
  };

  render() {
    const globalProxyEnabled = this.state.interfaceList.every((item) => {
      return item.proxyConfig.enabled;
    });

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
                  interfaceGroupList={this.state.interfaceGroupList}
                  updateInterfaceList={this.updateInterfaceList}
                  groupList={this.state.groupList}
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
          {this.state.interfaceList.length ? (
            this.state.subRouter === interfaceTabSymbol && (
              <InterfaceDetail
                experimentConfig={this.props.experimentConfig}
                selectedInterface={this.state.selectedInterface}
                updateInterfaceList={this.updateInterfaceList}
                globalProxyEnabled={globalProxyEnabled}
                key={this.state.selectedInterface.uniqId}
              />
            )
          ) : (
            <div className="interface-detail">
              <Empty
                className="add-api-hint"
                image={<Icon type="empty" height={120} />}
                description={this.props.intl.formatMessage({ id: 'project.createApi' })}
              />
            </div>
          )}
          {this.state.subRouter === realTimeTabSymbol && (
            <RealTimeDetail
              interfaceList={this.state.interfaceList}
              realTimeData={this.state.realTimeDataList[this.state.realTimeIndex]}
            />
          )}
        </Content>
      </Layout>
    );
  }
}

export default injectIntl(Project);
