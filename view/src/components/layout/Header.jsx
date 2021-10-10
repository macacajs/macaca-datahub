import React from 'react';
import GitHubButton from 'react-github-button';

import {
  Layout,
  Tooltip,
} from 'antd';

import {
  FormattedMessage,
} from 'react-intl';

import SelectHub from '../SelectHub';

import './header.less';

const Header = Layout.Header;

export default ({ links, pageConfig, context }) => {
  return (
    <Header className="header">
      <a href="/" className="title-con">
        <img src="//macacajs.github.io/macaca-datahub/logo/logo-color.svg" />
        <span className="title">DataHub</span>
      </a>
      {
        pageConfig.pageId === 'project' && <SelectHub
          allProjects={context.allProjects}
          projectName={context.projectName}
        />
      }
      <ul className="nav">
        <li style={{marginTop: '30px'}}>
          <GitHubButton
            type="stargazers"
            namespace="macacajs"
            repo="macaca-datahub"
          />
        </li>
        <li className="portrait">
          <Tooltip placement="bottom" title={'hi Macaca!'}>
            <a className="mask">
              <img src="//npmcdn.com/macaca-logo@latest/svg/monkey.svg" />
            </a>
          </Tooltip>
        </li>
        <li>
          <a href={ `${links.issue}?utf8=%E2%9C%93&q=` } target="_blank">
            <h3><FormattedMessage id="common.issue" /></h3>
          </a>
        </li>
        <li>
          <a href={ navigator.language === 'zh-CN' ? `${links.document}/zh` : links.document } target="_blank">
            <h3><FormattedMessage id="common.guide" /></h3>
          </a>
        </li>
      </ul>
    </Header>
  );
};
