#!/usr/bin/env node
const io = require('socket.io');
/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('nodejscurso:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3010');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
console.log('inicializando socket');
const socket = require("./io").init(server);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
socket.origins("*:*");


  socket.on("connect", (client) => {
    //   console.log(client);
    // const user = client.request.user.user;
    console.log(`connected to socket ${client.id}`);
    
    client.on('global', (data) => {
        console.log('emit global')
        client.broadcast.emit('global', data);
    });

    client.on('fileupload', (data) => {
      client.broadcast.emit('fileupload', data);
    });

    client.on("disconnect", () => {
        console.log('disconneted user :' + client.id);
    })
  });

  socket.of("/").adapter.on("error", function(err) {
    console.log(err);
  });
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
