import amiI from 'asterisk-manager';
import fs from 'fs';

// 5030, '10.1.43.12', 'admin', 'ippbx'
class actionsController {
    async login(req, res) {
        const { IPPabx, port, user, password } = req.query;
        const ami = new amiI(port, IPPabx, user, password);
        ami.keepConnected();

    }

    async logoff(req, res) {
        
    }

    async actionExtenStatus(req, res) {
        const { extension, IPPabx, port, user, password } = req.query;
        console.log(req.query);
        let responsee;
        const ami = new amiI(port, IPPabx, user, password);

        ami.keepConnected();
     
        ami.connect();
        ami.action({
            'action': 'ExtensionState',
            'context': 'ippbx-from-extensions',
            'exten': extension,
            'actionid': '1',
        }, function(err, ress) {
            console.log(ress);
            responsee = ress
         });


        setTimeout(() => {
            ami.disconnect();

            return res.json(responsee)
        }, 100);
    }

    async actionSipPeers(req, res) {
        const { IPPabx, port, user, password } = req.query;
        console.log(req.query);
        const allExtension = [];

        const ami = new amiI(port, IPPabx, user, password)

        ami.keepConnected();

        ami.on('managerevent', function(evt) {
            console.log(evt);
            if (evt.event === 'PeerEntry') {
                allExtension.push({
                    exten: evt.objectname,
                    host: evt.ipaddress,
                    portExten: evt.ipport
                }) 
            }
        });
        
        ami.connect();
        ami.action({
            'action': 'SipPeers',
            'actionid': '2',
        }, function(err, ress) {
        });


        setTimeout(() => {
            ami.disconnect();

            return res.json(allExtension)
        }, 200);
    }

    async actionRegistered(req, res) {
        const { IPPabx, port, user, password } = req.query;
        console.log(req.query);
        const registeredExtension = [];

        const ami = new amiI(port, IPPabx, user, password);

        ami.keepConnected();

        ami.on('managerevent', function(evt) {
            console.log(evt);
            if (evt.event === 'PeerStatus') {
                registeredExtension.push({
                    exten: evt.peer,
                    registered: evt.peerstatus
                })
            }
        });
        
        ami.connect();

        setTimeout(() => {

            return res.json(registeredExtension)
        }, 30000);
    }
}


export default new actionsController();

// asteri.action({
//     'action': 'ExtensionState',
//     'context': 'ippbx-from-extensions',
//     'exten': '5017',
//     'actionid': '1'
// }, function(err, res) {
//     console.log(res);
// })
// console.log(responsee);
// setTimeout(() => {
//     asteri.disconnect();
// }, 5000);

        
        // ami.on('response', function(evt) {
        //     console.log(evt);
        // });


    //     async actionExten(req, res) {
    //         let responsee;
    //         ami.keepConnected();
     
    // // Listen for any/all AMI events.
    //         ami.on('managerevent', function(evt) {
    //             console.log(evt)
    //         });   
    //         ami.connect();
    //         ami.action({
    //             'action': 'ExtensionState',
    //             'context': 'ippbx-from-extensions',
    //             'exten': '5017',
    //             'actionid': '1',
    //         }, function(err, ress) {
    //             // let data = fs.read(ress, 'utf8', function(err, data) {
    //             //     console.log(data);
    //             // })
    //             console.log(ress);
    //             console.log('5');
    //             responsee = ress
    
    //         });
    //         ami.action({
    //             'action': 'Logoff',
    //         }, function(err, ress) {
    //             console.log(ress)
    //             console.log('6');
    //         });
            
            
    //         console.log('7');
    //         setTimeout(() => {
    //             console.log('14');
    //             ami.disconnect();
    //             console.log(responsee)
    //             return res.json(responsee)
    //             }, 1500);
    //     }