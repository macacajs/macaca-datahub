'use strict';
const uuid = require('uuid/v4');

const definitions = {};

const replaceRef = obj => {
  if (!obj) return;

  Object.keys(obj).forEach(item => {
    if (!obj[item]) return;

    if (obj[item].$ref) {
      obj[item] = definitions[obj[item].$ref];
    } else if (typeof obj[item] === 'object') {
      replaceRef(obj[item]);
    }
  });
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
    replaceRef(definitions[definition]);
  });

  Object.keys(data.paths).forEach(pathname => {
    if (!data.paths[pathname]) return;

    Object.keys(data.paths[pathname]).forEach(method => {
      if (!data.paths[pathname][method]) return;

      const info = data.paths[pathname][method];
      const interfaceUniqId = uuid();
      const willHandleResponse = info.responses
        && info.responses['200']
        && info.responses['200'].schema;

      replaceRef(info.parameters);
      if (willHandleResponse) {
        replaceRef([ info.responses['200'].schema ]);
      }

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
      if (willHandleResponse) {
        paramReponseSchema = info.responses['200'].schema;
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
