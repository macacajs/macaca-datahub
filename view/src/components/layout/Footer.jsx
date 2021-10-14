import React from 'react';

import {
  Menu,
  Dropdown,
} from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

import './footer.less';
import Experiment from '../Experiment';

export default ({
  links,
  currentLocale,
  showSideItems = false,
  changeLang,
  updateExperimentConfig,
  experimentConfig,
}) => {
  const langList = [
    'zh-CN',
    'en-US',
  ];
  const menu = (
    <Menu>
      {
        langList
          .filter(lang => lang !== currentLocale)
          .map(lang => {
            return (
              <Menu.Item key={lang} onClick={({ key }) => {
                changeLang(key);
              }}>
                {lang}
              </Menu.Item>
            );
          })
      }
    </Menu>
  );

  return (
    <div className="footer-container">
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={ links.homepage }
      > &copy;&nbsp; Macaca Team 2015-{ new Date().getFullYear() } </a>
      <ul className="footer-side-items">
        <li>
          <Dropdown overlay={menu} placement="topCenter">
            <a rel="noopener noreferrer">{ <GlobalOutlined /> } { currentLocale }</a>
          </Dropdown>
        </li>
        { showSideItems &&
          <li>
            <Experiment
              experimentConfig={experimentConfig}
              updateExperimentConfig={updateExperimentConfig}
            />
          </li>
        }
      </ul>
    </div>
  );
};
