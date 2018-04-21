'use strict';

const _ = require('lodash');

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

const tableData = {
  children: [],
};

function parse(model, pItem) {
  const tableItem = {
    field: model._field,
    required: model._required || false,
    description: model.description || '',
    type: model.type,
  };
  pItem.children.push(tableItem);

  if (model.type === 'object') {
    loopProperties(model, tableItem);
  } else if (model.type === 'array') {
    if (_.isArray(model.items)) {
      console.log('todo');
    } else { // object
      if (model.items.type === 'object') {
        loopProperties(model.items, tableItem);
      } else {
        console.log('todo');
      }
    }
  }
}

function loopProperties(model, tableItem) {
  const properties = model.properties;
  if (properties && Object.keys(properties).length) {
    tableItem.children = [];
    properties && Object.keys(properties).forEach(key => {
      const _model = properties[key];
      _model._field = key;
      _model._required = (model.required || []).indexOf(key) !== -1;
      parse(_model, tableItem);
    });
  }
}

module.exports = {
  toJSONSchema: macacaSchema => {
    const model = { ...schemaModel };
    model.required = macacaSchema.filter(c => c.required).map(c => c.field);
    parseSchema(macacaSchema, model);
    return model;
  },
  toTableData: schemaData => {
    const table = { ...tableData };
    parse(schemaData, table);
    return table.children[0].children;
  },
};
