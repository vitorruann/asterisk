import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: '*'
});
httpServer.listen(3335);

class sipCallController {
    async incomingCall(req, res) {
        let { num } = req.query;
        num = num.toString().split(/[:@]/g);
        num = num[1];
        io.emit('newCall', num);

        // io.on('newCall', (socket) => {
        //     console.log(socket);
        //     socket.emit(num);
        // });

        setTimeout(() => {
            return res.json(num);
            
        }, 2000);
    }
}

export default new sipCallController();

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