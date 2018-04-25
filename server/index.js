const express = require('express');
const cors = require('cors');
const {json} = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const {generateKey, validateKey} = require(`${__dirname}/controllers/keyController`);

const port = 3001;
const app = express();

app.use(json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user has connected to the system.');

  socket.on('Message', (message) => {
    io.sockets.emit('Message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const message = [];

const getDataAndEmit = (socket) => {
  try {
    socket.emit('Message', message);
  } catch (error) {
    console.error(error);
  }
};

app.get('/keys/generate', generateKey);
app.get('/keys/validate/:key', validateKey);

server.listen(port, () => console.log(`Dr. Crane is listening on ${port}`));
