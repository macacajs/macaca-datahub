'use strict';

import React from 'react';
import {
  Row,
  Col,
  Button,
  Icon,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

import './Home.less';

const pkg = require('../../package.json');

function Home (props) {
  const formatMessage = props.intl.formatMessage;
  const features = [
    { icon: 'cloud-o', text: 'home.icon.cloud' },
    { icon: 'team', text: 'home.icon.team' },
    { icon: 'camera-o', text: 'home.icon.snapshot' },
    { icon: 'sync', text: 'home.icon.dataflow' },
    { icon: 'rocket', text: 'home.icon.quick' },
    { icon: 'eye-o', text: 'home.icon.scene' },
    { icon: 'clock-circle-o', text: 'home.icon.continues' },
    { icon: 'book', text: 'home.icon.document' },
    { icon: 'fork', text: 'home.icon.versioning' },
    { icon: 'tool', text: 'home.icon.setting' },
    { icon: 'database', text: 'home.icon.database' },
    { icon: 'save', text: 'home.icon.save' },
    { icon: 'disconnect', text: 'home.icon.decentration' },
    { icon: 'api', text: 'home.icon.api' },
    { icon: 'code-o', text: 'home.icon.cli' },
    { icon: 'global', text: 'home.icon.i18n' },
    { icon: 'github', text: 'home.icon.github' },
    { icon: 'download', text: 'home.icon.download', experiment: true },
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
                    icon="rocket"
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
                    icon="github"
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
                features.map(({ icon, text, experiment = false }) => {
                  return (
                    <Col key={`${icon}-${text}`} span={4}>
                      <Icon type={icon} />
                      <div className="text">{formatMessage({ id: text })}
                        { experiment && <Icon type="experiment" style={{
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
