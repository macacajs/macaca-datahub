'use strict';

const assert = require('assert');

module.exports = {
  success(data = {}) {
    this.body = {
      success: true,
      data,
    };
  },

  fail(message = '', data) {
    this.body = {
      success: false,
      message,
      data,
    };
  },

  assertParam(params = {}) {
    for (const key in params) {
      assert(params[key], new TypeError(`${key} is required`));
    }
  },
};
