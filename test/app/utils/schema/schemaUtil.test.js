'use strict';

const path = require('path');
const diff = require('deep-diff').diff;
const { assert } = require('egg-mock/bootstrap');
const schemaUtil = require('../../../../app/util/schemaUtil');

const requireUncached = module => {
  delete require.cache[require.resolve(module)];
  return require(module);
};

const getSchemaFile = folder => {
  return requireUncached(path.resolve(__dirname, 'data', folder, 'expectedSchema.json'));
};

const getMacacaSchemaFile = folder => {
  return requireUncached(path.resolve(__dirname, 'data', folder, 'macacaSchema.json'));
};

const diffSchema = (schema, macacaSchema) => {
  return diff(schema, schemaUtil.toJSONSchema(macacaSchema));
};

describe('schemaUtil test', () => {
  it('parse to schema', function() {
    const folder = 'required';
    const diffResult = diffSchema(getSchemaFile(folder), getMacacaSchemaFile(folder));
    diffResult && console.log(JSON.stringify(diffResult, null, 2));
    assert(!diffResult, true);
  });
});
