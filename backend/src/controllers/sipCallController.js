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

    async infPhone(req, res) {
        const {statusPhone} = req.params;
        const modelPhone = JSON.stringify(req.headers).match(/[V][0-9]{0,5}/g).toString();

        console.log(modelPhone, statusPhone);
        
        io.emit('modelPhone', {
            modelPhone,
            statusPhone: statusPhone
        });

        setTimeout(() => {
            return res.json({mes: 'ok'})
            
        }, 100);
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

    async callFunctions(req, res) {
        const {userPhone, passwordPhone, ipPhone, functionCall } = req.query;
        let statusFunction = null;

        switch (functionCall) {
            case 'DNDON':
            http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                statusFunction = resp.statusCode;
            });
    
            setTimeout(() => {
                return res.json(statusFunction);
            }, 100);
              break;

            case 'DNDOFF':
            http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                statusFunction = resp.statusCode;
            });
    
            setTimeout(() => {
                return res.json(statusFunction);
            }, 100);
                break;
      
            case 'VOLUME_UP':
            http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                statusFunction = resp.statusCode;
            });
    
            setTimeout(() => {
                return res.json(statusFunction);
            }, 100);
              break;
              
            case 'UP':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                    statusFunction = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusFunction);
                }, 100);
              break;   
      
            case 'DSS1':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                    statusFunction = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusFunction);
                }, 100);
              break;
      
            case 'LEFT':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                    statusFunction = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusFunction);
                }, 100);
              break;
      
            case 'OK':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                    statusFunction = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusFunction);
                }, 100);
              break;
      
            case 'RIGHT':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                    statusFunction = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusFunction);
                }, 100);
              break;
      
            case 'VOLUME_DOWN':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                    statusFunction = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusFunction);
                }, 100);
              break;
      
            case 'DOWN':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                    statusFunction = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusFunction);
                }, 100);
              break;
      
            case 'DSS2':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                    statusFunction = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusFunction);
                }, 100);
              break;
      
            case 'MUTE':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                    statusFunction = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusFunction);
                }, 100);
              break;
      
            case 'RD':
                http.get(`http://${userPhone}:${passwordPhone}@${ipPhone}/cgi-bin/ConfigManApp.com?key=${functionCall}`, function(resp) {
                    statusFunction = resp.statusCode;
                });
        
                setTimeout(() => {
                    return res.json(statusFunction);
                }, 100);
              break;
      
            default:
              break;
        }
    }
}


export default new sipCallController();