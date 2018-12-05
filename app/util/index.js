'use strict';
const uuid = require('uuid/v4');

const definitions = {};

const replaceRef = obj => {
  Object.keys(obj).forEach(item => {
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
    Object.keys(data.paths[pathname]).forEach(method => {
      const info = data.paths[pathname][method];
      const interfaceUniqId = uuid();
      const willHandleResponse = data.paths[pathname][method].responses
        && data.paths[pathname][method].responses['200']
        && data.paths[pathname][method].responses['200'].schema;

      replaceRef(data.paths[pathname][method].parameters);
      if (willHandleResponse) {
        replaceRef([ data.paths[pathname][method].responses['200'].schema ]);
      }

      // handle Schema request param
      const paramRequestSchema = {
        type: 'object',
        properties: {},
      };
      data.paths[pathname][method].parameters.forEach(param => {
        handleParamRequestSchema(param, paramRequestSchema);
      });

      // handle Schema response param
      let paramReponseSchema = {
        type: 'object',
        properties: {},
      };
      if (willHandleResponse) {
        paramReponseSchema = data.paths[pathname][method].responses['200'].schema;
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
