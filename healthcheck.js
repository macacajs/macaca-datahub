'use strict';

const request = require('request');

request('http://172.17.0.2:9200', error => {
  if (error) {
    throw error;
  }
});
