const express = require('express');
const cors = require('cors');
const {json} = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const rand = require('random-key');

const port = 3001;
const app = express();

app.use(json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

const messages = [];
const keyHistory = [];

io.on('connection', (socket) => {
  console.log('A user has connected to the system.');

  socket.on('send message', (message) => {
    messages.unshift({message: message.message, user: message.user, id: rand.generate(16)});
    console.log(messages[messages.length - 1]);
    io.sockets.emit('get messages', messages);
  });

  socket.on('delete message', (id) => {
    const index = messages.findIndex(message => message.id === id);
    if (index !== -1) {
      messages.splice(index, 1);
      io.sockets.emit('delete message', messages);
    }
  });

  socket.on('generate code', (input) => {
    console.log('Generating key...');
    const key = rand.generate(6);
    keyHistory.push(key);
    io.sockets.emit('generation response', key);
  });

  socket.on('verify code', (key) => {
    console.log('Validating key...');
    keyHistory.includes(key)
      ? io.sockets.emit('validation response', true)
      : io.sockets.emit('validation response', false);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => console.log(`Dr. Crane is listening on ${port}`));
