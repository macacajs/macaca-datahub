import React from 'react';
import GitHubButton from 'react-github-button';

import { Layout } from 'antd';

import SelectHub from '../SelectHub';
import Icon from '../Icon';

import './header.less';

const { Header } = Layout;

export default function ({ links, pageConfig, context }) {
  return (
    <Header className="header">
      <a href="/" className="title-con">
        <Icon
          width={30}
          type="logo-color"
          style={{
            position: 'relative',
            top: 8,
          }}
        />
        <span className="title">DataHub</span>
      </a>
      {pageConfig.pageId === 'project' && (
        <SelectHub allProjects={context.allProjects} projectName={context.projectName} />
      )}
      <ul className="nav">
        <li style={{ marginTop: '30px' }}>
          <GitHubButton type="stargazers" namespace="macacajs" repo="macaca-datahub" />
        </li>
        <li>
          <a href={`${links.issue}?utf8=%E2%9C%93&q=`} target="_blank">
            <h3>
              {__i18n('问题反馈')}
            </h3>
          </a>
        </li>
        <li>
          <a
            href={window.localStorage.DATAHUB_LANGUAGE === 'zh-CN' ? `${links.document}/zh` : links.document}
            target="_blank"
          >
            <h3>
              {__i18n('产品介绍')}
            </h3>
          </a>
        </li>
      </ul>
    </Header>
  );
}
