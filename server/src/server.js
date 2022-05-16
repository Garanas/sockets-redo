
// - constants

const PORT = 3000;

// - importing

const http = require('http');
const io = require('socket.io');

const api = require('./api');
const sockets = require('./sockets');

// - functionality

// prepare for listening
const httpServer = http.createServer(api);
const socketServer = io(httpServer);

// start listening
httpServer.listen(PORT);
sockets.listen(socketServer);

