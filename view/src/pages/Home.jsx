'use strict';

import React from 'react';
import {
  Row,
  Col,
  Button,
} from 'antd';

import {
  RocketOutlined, GithubOutlined,
  CloudOutlined, TeamOutlined,
  CameraOutlined, SyncOutlined,
  EyeOutlined, ClockCircleOutlined,
  BookOutlined, ForkOutlined,
  ToolOutlined, DatabaseOutlined,
  SaveOutlined, DisconnectOutlined,
  ApiOutlined, CodeOutlined,
  GlobalOutlined, DownloadOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

import {
  injectIntl,
} from 'react-intl';

import './Home.less';

const pkg = require('../../package.json');

function Home (props) {
  const formatMessage = props.intl.formatMessage;
  const features = [
    { text: 'home.icon.cloud', icon: <CloudOutlined /> },
    { text: 'home.icon.team', icon: <TeamOutlined /> },
    { text: 'home.icon.snapshot', icon: <CameraOutlined /> },
    { text: 'home.icon.dataflow', icon: <SyncOutlined /> },
    { text: 'home.icon.quick', icon: <RocketOutlined /> },
    { text: 'home.icon.scene', icon: <EyeOutlined /> },
    { text: 'home.icon.continues', icon: <ClockCircleOutlined /> },
    { text: 'home.icon.document', icon: <BookOutlined /> },
    { text: 'home.icon.versioning', icon: <ForkOutlined /> },
    { text: 'home.icon.setting', icon: <ToolOutlined /> },
    { text: 'home.icon.database', icon: <DatabaseOutlined /> },
    { text: 'home.icon.save', icon: <SaveOutlined /> },
    { text: 'home.icon.decentration', icon: <DisconnectOutlined /> },
    { text: 'home.icon.api', icon: <ApiOutlined /> },
    { text: 'home.icon.cli', icon: <CodeOutlined /> },
    { text: 'home.icon.i18n', icon: <GlobalOutlined /> },
    { text: 'home.icon.github', icon: <GithubOutlined /> },
    { text: 'home.icon.download', icon: <DownloadOutlined />, experiment: true },
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
                  <span>DataHub</span> - {formatMessage({id: 'common.slogan'})}
                </p>
                <a className="go-btn" href="/dashboard">
                  <Button
                    data-accessbilityid="go-btn-dashboard"
                    type="primary"
                    icon={<RocketOutlined />}
                    size="large"
                    ghost
                  >{formatMessage({id: 'home.go'})}
                  </Button>
                </a>
                <a
                  className="go-btn github"
                  target="_blank"
                  href={ pkg.links.homepage }
                >
                  <Button
                    type="primary"
                    icon={<GithubOutlined />}
                    size="large"
                    ghost
                  >GITHUB
                  </Button>
                </a>
                <p className="versioning">
                  v{ window.pageConfig.version }
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={18}>
            <Row className="desc-icons">
              {
                features.map(({ text, icon, experiment = false }) => {
                  return (
                    <Col key={text} span={4}>
                      {icon}
                      <div className="text">{formatMessage({ id: text })}
                        { experiment && <ExperimentOutlined style={{
                          fontSize: '12px',
                          transform: 'scale(.6)',
                        }}/> }
                      </div>
                    </Col>
                  );
                })
              }
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default injectIntl(Home);
