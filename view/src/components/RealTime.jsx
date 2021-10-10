'use strict';

import React from 'react';
import {
  Row,
  Badge,
} from 'antd';

import './RealTime.less';

export default class RealTime extends React.Component {
  render () {
    const {
      realTimeDataList,
    } = this.props;
    const statusBadge = status => {
      status = String(status);
      if (status.startsWith('2')) {
        return 'success';
      }
      if (status.startsWith('3')) {
        return 'warning';
      }
      if (status.startsWith('4')) {
        return 'error';
      }
      if (status.startsWith('5')) {
        return 'error';
      }
      return 'default';
    };
    return (
      <div className="real-time">
        {
          realTimeDataList.map((data, index) => {
            return (
              <Row
                key={index}
                data-accessbilityid={`real-time-line-${index}`}
                className={`real-time-line ${index === this.props.realTimeIndex ? 'clicked' : ''}`}
                onClick={this.props.onSelect.bind(this, index)}
              >
                <div>
                  <b className={`real-time-method ${data.req.method.toLowerCase()}`}>
                    {data.req.method}
                  </b>
                  <span className="real-time-path">{data.req.path}</span>
                  <span className="real-time-date">{data.date}</span>
                </div>
                <div>
                  <span className="real-time-status">
                    <Badge
                      status={statusBadge(data.res.status)}
                      text={data.res.status}
                    />
                  </span>
                  <span className="real-time-host">{data.res.host}</span>
                </div>
              </Row>
            );
          })
        }
      </div>
    );
  }
};
