'use strict';

const io = require('socket.io')();

class SocketMQ {

  constructor() {
    io.on('connection', function() {
    });
  }

  emit(data) {
    setTimeout(() => {
      io.sockets.emit('test event', data);
    }, 16);
  }

  listen(port) {
    console.log(`websocket server start at: ${port}`);
    io.listen(port);
  }
}

module.exports = new SocketMQ();
