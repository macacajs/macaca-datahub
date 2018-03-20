'use strict';

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
};
