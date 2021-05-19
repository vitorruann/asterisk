import http, { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: '*'
});
httpServer.listen(3335);

class sipCallController {
    async callStatus(req, res) {
        const { typeCall } = req.params;
        let { data } = req.query;
        let duration = null;
        
        console.log(data, typeCall)
        if (typeCall === 'endCall') {
            duration = data;

            io.emit('statusCall', {
                numberID: '',
                typeCall,
                duration
            });
        } if (typeCall === 'inCall'){
            io.emit('statusCall', {
                numberID: '',
                typeCall,
                duration
            });
        } else {
            data = data.toString().split(/[:@]/g);
            io.emit('statusCall', {
                numberID: data[1],
                typeCall,
                duration
            });
        }



        // io.on('newCall', (socket) => {
        //     console.log(socket);
        //     socket.emit(num);
        // });

        setTimeout(() => {
            return res.json(data);
            
        }, 2000);
    }

    async call(req, res) {
        const {numbToCall, userPhone, passwordPhone, ipPhone, action } = req.query;
        let statusCall = null;

        switch (action) {
            case 'makeACall':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=SPEAKER;${numbToCall};OK`, function(resp) {
                    statusCall = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusCall);
                }, 100);
                break;

            case 'hangUp':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=F_ACCEPT`, function(resp) {
                    statusCall = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusCall);
                }, 100);
                break;

            case 'hangOut':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=RELEASE`, function(resp) {
                    statusCall = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusCall);
                }, 100);
                break;
            //http://admin:admin@192.168.1.101/cgi-bin/ConfigManApp.com?key=F_TRANSFER;5000;F_TRANSFER
            case 'transferCall':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=F_TRANSFER;${numbToCall};F_TRANSFER`, function(resp) {
                    statusCall = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusCall);
                }, 100);
                break;
            
            default:
                return res.json({error: 'Algo de errado não está certo'})
        }
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