'use strict';

const assert = require('assert');

module.exports = {
  success(data = {}) {
    this.body = {
      success: true,
      data,
    };
  },

  fail(message = '') {
    this.body = {
      success: false,
      message,
    };
  },

  assertParam(params = {}) {
    for (const key in params) {
      assert(params[key], new TypeError(`${key} is required`));
    }
  },
};
