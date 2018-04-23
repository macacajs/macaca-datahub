'use strict';

const Ajv = require('ajv');

const validateSchema = (schemaData, data) => {
  const ajv = new Ajv();
  const isValid = ajv.validate(schemaData, data);
  return {
    isValid,
    errors: ajv.errors,
  };
};

const needValidate = schemaContent => {
  return schemaContent.enableSchemaValidate && schemaContent.schemaData;
};

module.exports = () => {
  return async function schemaValidation(ctx, next) {
    let {
      reqSchemaContent = '{}',
      resSchemaContent = '{}',
    } = await ctx.service.data.getSchemaData(ctx.params.projectId, ctx.params.dataId);

    try {
      reqSchemaContent = JSON.parse(reqSchemaContent);
      resSchemaContent = JSON.parse(resSchemaContent);
    } catch (e) {
      ctx.body = {
        success: false,
        message: 'validation schema parse error please format it or disable schema validation',
        errors: {
          projectId: ctx.params.projectId,
          dataId: ctx.params.dataId,
        },
      };
    }

    if (needValidate(reqSchemaContent)) {
      const {
        isValid,
        errors,
      } = validateSchema(reqSchemaContent.schemaData, ctx.request.body);

      if (!isValid) {
        ctx.body = {
          success: false,
          message: 'schema validation error',
          errors,
        };
        return; // not go on
      }
    }

    await next();

    if (needValidate(resSchemaContent)) {
      const {
        isValid,
        errors,
      } = validateSchema(resSchemaContent.schemaData, ctx.response.body);
      if (!isValid) {
        ctx.body = {
          success: false,
          message: 'schema validation error',
          errors,
        };
      }
    }
  };
};
