'use strict';

const request = require('request');

request('http://0.0.0.0:9200', error => {
  if (error) {
    throw error;
  }
});
