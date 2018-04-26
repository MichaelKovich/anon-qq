const express = require('express');
const cors = require('cors');
const {json} = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const rand = require('random-key');
const _remove = require('lodash/remove');

const port = 3001;
const app = express();

app.use(json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

const messages = [];
const keyHistory = new Set();

io.on('connection', socket => {
  console.log('A user has connected to the system.');
  socket.on('send message', message => {
    if (keyHistory.has(message.key)) {
      messages.unshift({
        message: message.message,
        key: message.key,
        user: message.user,
        id: rand.generate(16)
      });
      const messagesForRoom = messages.filter(
        oneMessage => oneMessage.key === message.key
      );
      io.sockets.in(message.key).emit('get messages', messagesForRoom);
    } else {
      io.sockets
        .in(message.key)
        .emit('get messages', [
          {message: 'This room has been closed by the instructor.'}
        ]);
    }
  });

  socket.on('delete message', ({id, key}) => {
    const index = messages.findIndex(message => message.id === id);
    if (index !== -1) {
      messages.splice(index, 1);
      const messagesForRoom = messages.filter(message => message.key === key);
      io.sockets.in(key).emit('delete message', messagesForRoom);
    }
  });

  socket.on('generate code', input => {
    console.log('Generating key...');
    let key = rand.generate(6);
    while (keyHistory.has(key)) {
      key = rand.generate(6);
    }
    keyHistory.add(key);
    console.log('Key History: ', keyHistory);
    io.sockets.emit('generation response', key);
    socket.join(key);
  });

  socket.on('verify code', key => {
    console.log('Validating key...');
    console.log('Input Key: ', key);
    console.log('Key History: ', keyHistory);
    if (keyHistory.has(key)) {
      socket.join(key);
      io.sockets.emit('validation response', true);
      io.sockets
        .in(key)
        .emit('number of students', io.sockets.adapter.rooms[key].length - 1);
    } else {
      io.sockets.emit('validation response', false);
    }
  });

  socket.on('close room', key => {
    console.log('Closing room with Key: ', key);
    // let keyHistoryArr = [...keyHistory]
    // const keyIndex = keyHistoryArr.findIndex(singularKey => singularKey === key);
    keyHistory.delete(key);
    console.log('Key History: ', keyHistory);
    _remove(messages, message => message.key === key);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    if (keyHistory.size) {
      keyHistory.forEach(key => {
        io.sockets
          .in(key)
          .emit(
            'number of students',
            io.sockets.adapter.rooms[key] &&
              io.sockets.adapter.rooms[key].length - 1
          );
      });
    }
  });
});

server.listen(port, () => console.log(`Dr. Crane is listening on ${port}`));
