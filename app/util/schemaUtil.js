'use strict';

const schemaModel = {
  type: 'object',
  properties: {},
};

const parseSchema = (array, pModel) => {
  array.forEach(obj => {
    const {
      field,
      type,
      description,
      children,
    } = obj;

    let model = {};

    model = pModel.properties[field] = {
      type: type.toLowerCase(),
      title: description,
    };

    if (type === 'object' && children && children.length) {
      model.required = children.filter(c => c.required).map(c => c.field);
      model.properties = {};
      parseSchema(children, model);
    }

    if (type === 'array' && children && children.length) {
      model.items = {
        type: 'object',
      };
      model.items.required = children.filter(c => c.required).map(c => c.field);
      model.items.properties = {};
      parseSchema(children, model.items);
    }
  });
};

module.exports = {
  toJSONSchema: macacaSchema => {
    const model = { ...schemaModel };
    model.required = macacaSchema.filter(c => c.required).map(c => c.field);
    parseSchema(macacaSchema, model);
    return model;
  },
};
