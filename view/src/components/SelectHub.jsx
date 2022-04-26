import React, { PureComponent } from 'react';

import { Menu, Dropdown } from 'antd';

import { DownOutlined } from '@ant-design/icons';

export default class SelectHub extends PureComponent {
  render() {
    if (!this.props.allProjects) {
      return null;
    }

    const list = this.props.allProjects.map((item) => item.projectName);
    const { projectName } = this.props;

    if (list.length < 2) {
      return null;
    }

    const menu = (
      <Menu>
        {list.map((item, key) => (
          <Menu.Item key={key} data-accessbilityid={`dropdonw-list-${key}`}>
            <a href={`./${item}`}>{item}</a>
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <span style={{ marginLeft: '20px' }}>
        <Dropdown overlay={menu}>
          <span data-accessbilityid="dropdonw-list">
            {projectName} <DownOutlined />
          </span>
        </Dropdown>
      </span>
    );
  }
}
