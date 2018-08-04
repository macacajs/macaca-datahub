'use strict';

const {
  chalk,
} = require('xutil');
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
    console.log(`Websocket server start at: ${chalk.cyan(port)}`);
    io.listen(port);
  }
}

module.exports = new SocketMQ();
