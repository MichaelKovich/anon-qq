const express = require('express');
const cors = require('cors');
const {json} = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const rand = require('random-key');

const {generateKey, generateID, validateKey} = require(`${__dirname}/controllers/keyController`);

const port = 3001;
const app = express();

app.use(json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

const messages = [];

io.on('connection', (socket) => {
  console.log('A user has connected to the system.');

  socket.on('Message', (message) => {
    id = generateID(16);
    messages.push({message, id});
    console.log(messages[messages.length - 1]);
    io.sockets.emit('Message', {text: message, id});
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const deleteMessage = (req, res, next) => {
  const {id} = req.params;
  messages.forEach((message, index) => {
    console.log('ID HERE: ', id);
    if (message.id === id) {
      messages.splice(index, 1);
      res.status(200).json(messages);
    }
  });
};

app.get('/keys/generate', generateKey);
app.get('/keys/validate/:key', validateKey);
app.delete('/messages/delete/:id', deleteMessage);

server.listen(port, () => console.log(`Dr. Crane is listening on ${port}`));
