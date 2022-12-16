import React from 'react';
import { Row, Col, Button } from 'antd';
import {
  RocketOutlined,
  GithubOutlined,
  CloudOutlined,
  TeamOutlined,
  CameraOutlined,
  SyncOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  BookOutlined,
  ForkOutlined,
  ToolOutlined,
  DatabaseOutlined,
  SaveOutlined,
  DisconnectOutlined,
  ApiOutlined,
  CodeOutlined,
  GlobalOutlined,
  DownloadOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import './Home.less';

const pkg = require('../../package.json');

function Home(props) {
  const features = [
    { text: __i18n('云端部署'), icon: <CloudOutlined /> },
    { text: __i18n('团队协同'), icon: <TeamOutlined /> },
    { text: __i18n('请求快照'), icon: <CameraOutlined /> },
    { text: __i18n('数据流管理'), icon: <SyncOutlined /> },
    { text: __i18n('开箱即用'), icon: <RocketOutlined /> },
    { text: __i18n('多场景管理'), icon: <EyeOutlined /> },
    { text: __i18n('全周期覆盖'), icon: <ClockCircleOutlined /> },
    { text: __i18n('文档自动生成'), icon: <BookOutlined /> },
    { text: __i18n('数据版本化'), icon: <ForkOutlined /> },
    { text: __i18n('响应设置'), icon: <ToolOutlined /> },
    { text: __i18n('数据备份'), icon: <DatabaseOutlined /> },
    { text: __i18n('快速录入'), icon: <SaveOutlined /> },
    { text: __i18n('去中心化'), icon: <DisconnectOutlined /> },
    { text: __i18n('开放API'), icon: <ApiOutlined /> },
    { text: __i18n('命令行工具'), icon: <CodeOutlined /> },
    { text: __i18n('多语言支持'), icon: <GlobalOutlined /> },
    { text: __i18n('开源开放'), icon: <GithubOutlined /> },
    { text: __i18n('导出导入'), icon: <DownloadOutlined />, experiment: true },
  ];
  return (
    <Row type="flex" justify="center">
      <Col span={22} className="content">
        <Row type="flex" justify="center">
          <Col span={16}>
            <Row type="flex" justify="center">
              <Col span={12} className="big-image">
                <img src="//macacajs.github.io/macaca-datahub/assets/1556086490725-acfac2d7-cf35-487a-969c-808c1f8ade72.png" />
              </Col>
              <Col span={12}>
                <p className="slogan">
                  <span>DataHub</span> - {__i18n('全周期数据环境解决方案，提供命令行工具，支持场景管理，多端接入')}
                </p>
                <a className="go-btn" href="/dashboard">
                  <Button
                    data-accessbilityid="go-btn-dashboard"
                    type="primary"
                    icon={<RocketOutlined />}
                    size="large"
                    ghost
                  >
                    {__i18n('立即开始')}
                  </Button>
                </a>
                <a className="go-btn github" target="_blank" href={pkg.links.homepage}>
                  <Button type="primary" icon={<GithubOutlined />} size="large" ghost>
                    GITHUB
                  </Button>
                </a>
                <p className="versioning">v{window.pageConfig.version}</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={18}>
            <Row className="desc-icons">
              {features.map(({ text, icon, experiment = false }) => {
                return (
                  <Col key={text} span={4}>
                    {icon}
                    <div className="text">
                      {text}
                      {experiment && (
                        <ExperimentOutlined
                          style={{
                            fontSize: '12px',
                            transform: 'scale(.6)',
                          }}
                        />
                      )}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Home;
