'use strict';

import React, {
  PureComponent,
} from 'react';

import {
  Menu,
  Icon,
  Dropdown,
} from 'antd';

export default class SelectHub extends PureComponent {
  render () {
    if (!this.props.allProjects) {
      return null;
    }

    const list = this.props.allProjects
      .map(item => item.projectName);
    const projectName = this.props.projectName;

    if (list.length < 2) {
      return null;
    }

    const menu = (
      <Menu>
        {list.map((item, key) => {
          return (
            <Menu.Item key={key} data-accessbilityid={`dropdonw-list-${key}`}>
              <a href={`./${item}`}>{item}</a>
            </Menu.Item>
          );
        })}
      </Menu>
    );
    return (
      <span style={{ marginLeft: '20px' }}>
        <Dropdown overlay={menu}>
          <span data-accessbilityid="dropdonw-list">
            { projectName } <Icon type="down" />
          </span>
        </Dropdown>
      </span>
    );
  }
}

