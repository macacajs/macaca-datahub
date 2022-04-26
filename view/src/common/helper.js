import lodash from 'lodash';
import semver from 'semver';
import deepMerge from 'deepmerge';

const _ = lodash.merge({}, lodash);

const compareServerVersion = () =>
  new Promise((resolve, reject) => {
    const serverPkg = 'https://unpkg.com/macaca-datahub@latest/package.json';
    fetch(serverPkg)
      .then((res) => res.json())
      .then((res) => {
        const latestVesion = res.version;
        const currentVersion = window.pageConfig.version;
        resolve({
          shouldUpdate: semver.gt(latestVesion, currentVersion),
          latestVesion,
        });
      });
  });

const guid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const getSchemaChildren = (properties, requiredList = [], result) => {
  if (!properties) return null;

  const res = [];

  Object.keys(properties).forEach((item) => {
    const itemData = properties[item];
    const isArray = itemData.type === 'array' && itemData.items;
    const isArrayObj = isArray && itemData.items.type === 'object';
    const type = isArray ? `${itemData.type}<{${itemData.items.type || 'String'}}>` : itemData.type;

    const children = isArrayObj
      ? getSchemaChildren(itemData.items.properties, itemData.items.required, result)
      : getSchemaChildren(itemData.properties, itemData.required, result);

    const key = result.number++;

    result.expandedRowKeys.push(key);

    res.push({
      key,
      field: item,
      type,
      description: itemData.description,
      required: !!~requiredList.indexOf(item),
      children,
    });
  });
  return res;
};

const genSchemaList = (data) => {
  const result = {
    schema: [],
    expandedRowKeys: [],
    number: 0,
  };

  if (data.type === 'object') {
    // Object
    result.schema = getSchemaChildren(data.properties, data.required, result);
  } else if (data.type === 'array') {
    // Array
    const isArrayObj = data.items.type === 'object';
    const rootKey = guid();

    result.expandedRowKeys.push(rootKey);

    result.schema = [
      {
        key: rootKey,
        field: 'root(virtual)',
        type: `Array<{${data.items.type || 'String'}}>`,
        description: 'Array',
        required: false,
        children: isArrayObj ? getSchemaChildren(data.items.properties, data.items.required, result) : null,
      },
    ];
  }
  return result;
};

const queryParse = (url) => {
  const qs = {};
  if (!url) {
    return qs;
  }
  url.replace(/([^?=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    if ($3 === undefined) {
      return;
    }
    qs[$1] = decodeURIComponent($3);
  });
  return qs;
};

const serialize = (obj) => {
  const s = [];

  for (const item in obj) {
    const k = encodeURIComponent(item);
    const v = encodeURIComponent(obj[item] == null ? '' : obj[item]);
    s.push(`${k}=${v}`);
  }

  return s.join('&');
};

// 转换 JSON 为 Schema
const jsonToSchema = (jsonData) => {
  let contextSchema = {};
  const itemType = typeof jsonData;
  switch (itemType) {
    case 'string':
    case 'boolean':
    case 'number': {
      contextSchema = {
        type: itemType,
        description: '',
      };
      break;
    }
    case 'object': {
      if (Array.isArray(jsonData)) {
        let data = jsonData[0];

        if (typeof jsonData[0] === 'object') {
          data = jsonData.length > 1 ? deepMerge.all(jsonData) : jsonData[0];
        }
        contextSchema = {
          type: 'array',
          description: '',
          items: jsonToSchema(data),
        };
      } else {
        contextSchema = {
          type: 'object',
          description: '',
          properties: {},
          required: [],
        };

        for (const key in jsonData) {
          if (!jsonData.hasOwnProperty(key)) {
            continue;
          }
          contextSchema.properties[key] = jsonToSchema(jsonData[key]);
        }
        break;
      }
    }
  }
  return contextSchema;
};

const getExperimentConfig = () => {
  let experimentConfig = {
    isOpenCompactView: true,
  };
  const config = localStorage.getItem('DATAHUB_EXPERIMENT_CONFIG');

  if (!config) return experimentConfig;

  try {
    experimentConfig = JSON.parse(config);
  } catch (e) {
    console.error('It is error to parse JSON with experimentConfig');
  }
  return experimentConfig;
};

const setExperimentConfig = (option) => {
  const experimentConfig = getExperimentConfig();
  const result = Object.assign(experimentConfig, option);
  localStorage.setItem('DATAHUB_EXPERIMENT_CONFIG', JSON.stringify(result));
};

const throttle = (action, delay) => {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      action.apply(this, arguments);
    }, delay);
  };
};

_.guid = guid;
_.genSchemaList = genSchemaList;
_.queryParse = queryParse;
_.serialize = serialize;
_.jsonToSchema = jsonToSchema;
_.throttle = throttle;
_.compareServerVersion = compareServerVersion;

export {
  guid,
  genSchemaList,
  queryParse,
  serialize,
  jsonToSchema,
  getExperimentConfig,
  setExperimentConfig,
  throttle,
  compareServerVersion,
};

export default _;
