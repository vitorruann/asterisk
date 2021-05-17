import express from 'express';
import routes from './routes';
import cors from 'cors';
// import http from 'http';
// import io from 'so'
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// http.createServer(app)

app.listen(3334);

// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server, {
//   cors: {
//     origin: '*',
//   }
// });

// let messages = []

// io.on('connection', socket => {
//   console.log(`Socket conectado: ${socket.id}`);
//   socket.emit('id', socket.id);
  
//   socket.on('sendMessage', data => {
//     messages.push(data);
//     console.log(messages);
//     socket.emit('receivedMessage', messages);

//   });
// });