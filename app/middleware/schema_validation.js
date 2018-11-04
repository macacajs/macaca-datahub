'use strict';

const Ajv = require('ajv');

module.exports = () => {
  return async function schemaValidation(ctx, next) {
    const { projectName, pathname } = ctx.params;
    const method = ctx.method;
    const { uniqId: projectUniqId } = await ctx.service.project.queryProjectByName({ projectName });
    const interfaceData = await ctx.service.interface.queryInterfaceByHTTPContext({
      projectUniqId,
      pathname,
      method,
    });

    if (!interfaceData) {
      return await next();
    }
    const schemaList = await ctx.service.schema.querySchemaByInterfaceUniqId({
      interfaceUniqId: interfaceData.uniqId,
    });
    const reqSchemaContent = schemaList.find(i => i.type === 'request');
    const resSchemaContent = schemaList.find(i => i.type === 'response');

    await next();

    if (needValidate(reqSchemaContent)) {
      let result = {};

      if ([ 'POST', 'PUT' ].includes(ctx.method)) {
        result = validateSchema(reqSchemaContent.data.schemaData, ctx.request.body);
      } else {
        result = validateSchema(reqSchemaContent.data.schemaData, ctx.query);
      }

      if (result.isValid === false) {
        ctx.body = {
          success: false,
          message: 'request schema validation error',
          errors: result.errors,
        };
        return;
      }
    }

    if (needValidate(resSchemaContent)) {
      const {
        isValid,
        errors,
      } = validateSchema(resSchemaContent.data.schemaData, ctx.response.body);
      if (!isValid) {
        ctx.body = {
          success: false,
          message: 'response schema validation error',
          errors,
        };
      }
    }
  };
};

function validateSchema(schemaData, data) {
  const ajv = new Ajv({ allErrors: true });
  const isValid = ajv.validate(schemaData, data);
  return {
    isValid,
    errors: ajv.errors,
  };
}

function needValidate(reqSchemaContent) {
  return reqSchemaContent &&
    reqSchemaContent.data &&
    reqSchemaContent.data.enableSchemaValidate;
}
