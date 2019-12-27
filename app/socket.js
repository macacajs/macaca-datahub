'use strict';

const { chalk } = require('xutil');
const { EOL } = require('os');
const io = require('socket.io')();

class SocketMQ {

  constructor() {
    io.on('connection', function() {
    });
  }

  emit(data) {
    setTimeout(() => {
      io.sockets.emit('push data', data);
    }, 16);
  }

  listen(port) {
    console.log(`${EOL}Websocket server start at: ${chalk.cyan(port)}${EOL}`);
    io.listen(port);
  }
}

module.exports = new SocketMQ();
