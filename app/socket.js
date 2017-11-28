'use strict';

const io = require('socket.io')();

class SocketMQ {

  constructor() {
    io.on('connection', function(client) {
      setInterval(function() {
        console.log('----------')
        io.sockets.emit('test event', {});
      }, 1000);
    });
  }

  broadcast(data) {
    console.log(data)
    io.broadcast.emit('xxx', data);
    return
    io.on('connection', function(client) {
      console.log(client);
      setInterval(function() {
        io.broadcast.emit('xxx', {});
      }, 1000);
    });
  }

  listen(port) {
    console.log(`websocket server start at: ${port}`);
    io.listen(port);
  }
}

module.exports = new SocketMQ();
