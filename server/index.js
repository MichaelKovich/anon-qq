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
const keyHistory = [];

io.on('connection', (socket) => {
  console.log('A user has connected to the system.');
  socket.on('send message', (message) => {
    if (keyHistory.findIndex(keyRing => keyRing.classroomKey === message.key) !== -1) {
      messages.unshift({
        message: message.message,
        key: message.key,
        user: message.user,
        id: rand.generate(16),
      });
      const messagesForRoom = messages.filter(oneMessage => oneMessage.key === message.key);
      io.sockets.in(message.key).emit('get messages', messagesForRoom);
    } else {
      io.sockets
        .in(message.key)
        .emit('get messages', [{message: 'This room has been closed by the instructor.'}]);
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

  socket.on('generate key', () => {
    console.log('Generating key...');
    let classroomKey = rand.generate(6);
    const mentorKey = rand.generate(3);

    let index = keyHistory.findIndex(keyRing => keyRing.classroomKey === classroomKey);

    while (index !== -1) {
      classroomKey = rand.generate(6);
      index = keyHistory.findIndex(keyRing => keyRing.classroomKey === classroomKey);
    }

    const keyRing = {classroomKey, mentorKey};
    keyHistory.push(keyRing);

    console.log('Key History: ', keyHistory);
    io.sockets.emit('generation response', keyRing);
    socket.join(keyRing.classroomKey);
  });

  socket.on('verify key', (keyRing) => {
    const {classroomKey, mentorKey} = keyRing;

    console.log('Validating key...');
    console.log('Classroom Key: ', classroomKey);
    mentorKey && console.log('Mentor Key: ', mentorKey);
    console.log('Key History: ', keyHistory);

    if (keyHistory.findIndex(keyRing => keyRing.classroomKey === classroomKey) !== -1) {
      if (keyHistory.findIndex(keyRing => keyRing.mentorKey === mentorKey) !== -1) {
        socket.join(classroomKey);
        io.sockets.connected[socket.id].emit('validation response', {
          classroomKey: true,
          mentorKey: true,
        });
        io.sockets
          .in(classroomKey)
          .emit('number of students', io.sockets.adapter.rooms[classroomKey].length - 1);
      } else {
        socket.join(classroomKey);
        io.sockets.connected[socket.id].emit('validation response', {
          classroomKey: true,
          mentorKey: false,
        });
        io.sockets
          .in(classroomKey)
          .emit('number of students', io.sockets.adapter.rooms[classroomKey].length - 1);
      }
    } else {
      io.sockets.connected[socket.id].emit('validation response', {
        classroomKey: false,
        mentorKey: false,
      });
    }
  });

  socket.on('close room', (key) => {
    console.log('Closing room with Key: ', key);

    const index = keyHistory.findIndex(keyRing => keyRing.classroomKey === key);

    if (index !== -1) {
      keyHistory.splice(index, 1);
      console.log('Key History: ', keyHistory);
      _remove(messages, message => message.key === key);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    if (keyHistory.length) {
      keyHistory.forEach((keyRing) => {
        io.sockets
          .in(keyRing.classroomKey)
          .emit(
            'number of students',
            io.sockets.adapter.rooms[keyRing.classroomKey] &&
              io.sockets.adapter.rooms[keyRing.classroomKey].length - 1,
          );
      });
    }
  });
});

server.listen(port, () => console.log(`Dr. Crane is listening on ${port}`));
