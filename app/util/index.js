'use strict';
const uuid = require('uuid/v4');

const definitions = {};

const replaceRefForRequest = obj => {
  if (!obj) return;

  Object.keys(obj).forEach(item => {
    if (obj[item].$ref) {
      obj[item] = definitions[obj[item].$ref];
    } else if (typeof obj[item] === 'object') {
      replaceRefForRequest(obj[item]);
    }
  });
};

const replaceRefForResponse = obj => {
  if (obj.$ref) {
    obj.$ref = definitions[obj.$ref];
  } else {
    Object.keys(obj).forEach(item => {
      if (typeof obj[item] === 'object') {
        replaceRefForResponse(obj[item]);
      }
    });
  }
};

// up object level when find '$ref'
const repleceRefStringForResponse = obj => {
  const jsonStr = JSON.stringify(obj);
  const parseList = [];
  const deleteIdxs = [];
  const keyword = '"$ref":{';

  /**
   * '{"$ref":{"foo": "bar"}}' => ['{', '"$ref":{', '"foo": "bar"','}', '}']
   */
  const scan = () => {
    let idx = 0;
    let tmp = '';

    function clearTmp() {
      if (tmp) {
        parseList.push(tmp);
        tmp = '';
      }
    }

    while (idx < jsonStr.length) {
      const char = jsonStr[idx];
      if (char === '{') {
        if (tmp + char === keyword) {
          parseList.push(tmp + char);
          tmp = '';
        } else {
          clearTmp();
          parseList.push(char);
        }
      } else if (char === '}') {
        clearTmp();
        parseList.push(char);
      } else {
        tmp += char;
      }
      idx++;
    }
  };

  /**
   * recursion parseList, collecte index
   */
  const find = () => {
    let start = 0; // 第n个{
    const list = [];
    parseList.forEach((v, i) => {
      if (v === '{') {
        start += 1;
      }
      if (v === '}') {

        // {{{}}}
        if (list.indexOf(start) >= 0) {
          deleteIdxs.push(i);
        }
        start -= 1;
      }
      if (v === keyword) {
        deleteIdxs.push(i);
        list.push(start); // key include '{'
      }
    });
  };

  scan();
  find();

  const result = parseList.map((v, i) => {
    if (deleteIdxs.indexOf(i) >= 0) {
      return '';
    }
    return v;
  }).join('');
  return JSON.parse(result);
};

const handleParamRequestSchema = (param, paramRequestSchema) => {
  if (param.schema) {
    paramRequestSchema.properties[param.name] = {
      type: param.schema.type,
      description: param.description,
      required: param.schema.required,
      properties: param.schema.properties,
    };
  } else {
    paramRequestSchema.properties[param.name] = {
      ...param,
    };
  }
};

const swaggerConvert = data => {
  const result = [];

  Object.keys(data.definitions).forEach(definition => {
    definitions[`#/definitions/${definition}`] = data.definitions[definition];
  });

  Object.keys(definitions).forEach(definition => {
    replaceRefForRequest(definitions[definition]);
  });

  Object.keys(data.paths).forEach(pathname => {
    if (!data.paths[pathname]) return;

    Object.keys(data.paths[pathname]).forEach(method => {
      if (!data.paths[pathname][method]) return;

      const info = data.paths[pathname][method];
      const interfaceUniqId = uuid();
      const responseSchema = info.responses
        && info.responses['200']
        && info.responses['200'].schema;

      replaceRefForRequest(info.parameters);

      // handle Schema request param
      const paramRequestSchema = {
        type: 'object',
        properties: {},
      };

      if (info.parameters) {
        info.parameters.forEach(param => {
          handleParamRequestSchema(param, paramRequestSchema);
        });
      }

      // handle Schema response param
      let paramReponseSchema = {
        type: 'object',
        properties: {},
      };
      if (responseSchema) {
        const needHandleRef = JSON.stringify(responseSchema).indexOf('$ref') !== -1;

        // handle $ref
        if (needHandleRef) {
          replaceRefForResponse(responseSchema);
          paramReponseSchema = repleceRefStringForResponse(responseSchema);
        } else {
          if (responseSchema.type === 'object') {
            delete responseSchema.type;
            paramReponseSchema.properties = responseSchema;
          }
        }
      }

      const interfaceData = {
        pathname: pathname.replace(/^\//g, '').replace(/{(\S*)}/g, ($0, $1) => `:${$1}`),
        method: method.toUpperCase(),
        description: `${info.summary}. ${info.description}`,
        uniqId: interfaceUniqId,
        contextConfig: {},
        currentScene: 'default',
        proxyConfig: {},
        scenes: [],
        schemas: [{
          type: 'response',
          data: {
            schemaData: paramReponseSchema,
          },
          interfaceUniqId,
          uniqId: uuid(),
        }, {
          type: 'request',
          data: {
            schemaData: paramRequestSchema,
          },
          interfaceUniqId,
          uniqId: uuid(),
        }],
      };
      result.push(interfaceData);
    });
  });
  return result;
};

module.exports = {
  swaggerConvert,
};
