import React, { useEffect, useState } from 'react';

import { Menu, Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

import './footer.less';
import Experiment from '../Experiment';
import ThemeManager from '../../common/theme';

export default function ({
  links,
  currentLocale,
  showSideItems = false,
  changeLang,
  updateExperimentConfig,
  experimentConfig,
}) {
  const langList = ['zh-CN', 'en-US'];
  const localeMenu = (
    <Menu>
      {langList
        .filter((lang) => {
          return lang !== currentLocale;
        })
        .map((lang) => {
          return (
            <Menu.Item
              key={lang}
              onClick={({ key }) => {
                changeLang(key);
              }}
            >
              {lang}
            </Menu.Item>
          );
        })}
    </Menu>
  );

  const [currentTheme, setCurrentTheme] = useState(window.themeManager.getTheme());
  useEffect(() => {
    window.themeManager.switch(currentTheme);
  }, [
    currentTheme,
  ]);

  const themeMenu = (
    <Menu>
      {Object.keys(ThemeManager.THEMES)
        .filter(theme => { return theme !== currentTheme; })
        .map((theme) => {
          return (
            <Menu.Item
              key={theme}
              onClick={({ key }) => { return setCurrentTheme(key); }}
            >
              {theme}
            </Menu.Item>
          );
        })}
    </Menu>
  );

  return (
    <div className="footer-container">
      <a rel="noopener noreferrer" target="_blank" href={links.homepage}>
        {' '}
        &copy;&nbsp; Macaca Team 2015-{new Date().getFullYear()}{' '}
      </a>
      <ul className="footer-side-items">
        <li>
          <Dropdown overlay={themeMenu} placement="top">
            <a rel="noopener noreferrer">
              {currentTheme}
            </a>
          </Dropdown>
        </li>
        <li>
          <Dropdown overlay={localeMenu} placement="top">
            <a rel="noopener noreferrer">
              <GlobalOutlined /> {currentLocale}
            </a>
          </Dropdown>
        </li>
        {showSideItems && (
          <li>
            <Experiment experimentConfig={experimentConfig} updateExperimentConfig={updateExperimentConfig} />
          </li>
        )}
      </ul>
    </div>
  );
}
