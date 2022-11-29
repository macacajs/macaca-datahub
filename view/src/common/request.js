import 'whatwg-fetch';
import { message } from 'antd';
import debug from 'debug';

const { enableDatahubLogger } = window.pageConfig?.featureConfig || {};

const logger = debug('datahub:request');
const COMMON_HEADER = {
  'x-datahub-client': 'datahub-view',
};

const verbs = {
  GET(url) {
    return fetch(url, {
      credentials: 'same-origin',
      headers: COMMON_HEADER,
    });
  },

  POST(url, params) {
    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        ...COMMON_HEADER,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  },

  PUT(url, params) {
    return fetch(url, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        ...COMMON_HEADER,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  },

  DELETE(url) {
    return fetch(url, {
      headers: COMMON_HEADER,
      method: 'DELETE',
      credentials: 'same-origin',
    });
  },
};

export default async (url, method = 'GET', params = {}) => {
  let res = await verbs[method](url, params);
  if (!res.ok) {
    message.warn('Network Error');
    return {
      success: false,
      message: 'Network Error',
    };
  }

  res = await res.json();

  if (enableDatahubLogger) {
    if (Object.keys(params).length === 0) {
      logger('%s %s %o', method, url, res);
    } else {
      logger('%s %s %o %o', method, url, params, res);
    }
  }

  if (!res.success) {
    message.warn(res.message || 'Network Error');
  }
  return res;
};
