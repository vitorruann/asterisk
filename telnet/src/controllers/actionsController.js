import amiI from 'asterisk-manager';
let verify = 0;
// 5030, '10.1.43.12', 'admin', 'ippbx'
class actionsController {

    async actionExtenStatus(req, res) {
        const { extension, IPPabx, port, user, password } = req.query;
        // console.log(req.query.extension)
        const data = [];
        const response = [];
        const ami = new amiI(port, IPPabx, user, password);

        // ami.keepConnected();

        ami.connect();

        extension.map(ex =>{
            ex = ex.toString().replace('exten', "").replace('"', "").replace('"', "").replace(':', "")
            .replace('"', "").replace('"', "").replace('{', "").replace('}', "")
            data.push(ex.match(/\S{1,20}/g)); 
        });

        data.map(exten => {
            
            if (exten) {
                console.log(exten);

                ami.action({
                    'action': 'ExtensionState',
                    'context': 'from-internal',
                    'exten': exten,
                    'actionid': '1',
                }, function(err, ress) {
                    // console.log(ress);
                    response.push(ress)
                });
            }
            
        });
        

        setTimeout(() => {
            ami.disconnect();
            return res.json(response)
        }, 300);
    }

    async actionSipPeers(req, res) {
        const { IPPabx, port, user, password } = req.query;
        console.log(req.query);
        console.log(verify);

        const allExtension = [];
        
        const ami = new amiI(port, IPPabx, user, password)
        // ami.keepConnected();

        ami.on('managerevent', function(evt) {
            // console.log(evt);
            if (evt.event === 'PeerEntry') {
                allExtension.push({
                    exten: evt.objectname,
                    host: evt.ipaddress,
                    portExten: evt.ipport
                }) 
            }
        });
        // if (verify !== 0) {
        //     ami.action({
        //         'action': 'logoff',
        //     }, function(err, res) {
                
        //     });
        // }
        
        ami.connect();
        console.log(ami.connect());
        ami.action({
            'action': 'SipPeers',
            'actionid': '2',
        }, function(err, ress) {
        });

        setTimeout(() => {
            ami.disconnect();
            console.log(allExtension);
            verify = 1;
        console.log(verify);

            return res.json(allExtension)
        }, 200);
    }

    async actionRegistered(req, res) {
        const {allExtension, IPPabx, port, user, password } = req.query;
        // console.log(req.query.allExtension);
        const filterExtension = [];
        const data = [];

        const ami = new amiI(port, IPPabx, user, password);

        // ami.keepConnected();

        ami.on('managerevent', function(evt) {

            if (evt.response === 'Success' && evt.context === 'from-internal') {
            // console.log(evt.callerid.toString().indexOf("<"));
                console.log(evt.callerid)
                filterExtension.push({
                    exten: evt.objectname,
                    callID: evt.callerid, 
                }) 
            }
        });
        
        allExtension.map(ex =>{
            ex = ex.toString().replace('exten', "").replace('"', "").replace('"', "").replace(':', "")
            .replace('"', "").replace('"', "").replace('{', "").replace('}', "")
            console.log(ex)
            data.push(ex.match(/\S{1,20}/g)); 
        });


        data.map(exten => {
            console.log(exten)
            ami.action({
                'action': 'SipShowPeer',
                'Peer': exten,
                'actionid': '3',
            }, function(err, ress) {
                console.log(ress.response);
                if (ress.response === 'Success' && ress.context === 'from-internal') {
                    let ext = ress.callerid.match(/[0-9]{1,20}/g)
                    console.log(ress.callerid)
                    console.log(ext.length)
                    let finalPosition = ext.length -1;
                    filterExtension.push({
                        exten: ext[finalPosition],
                        callID: ress.callerid.match(/^"\S{1,20}"/g).toString().replace('"', "").replace('"', ""), 
                    }) 
                }
                
            });
        });
        
        ami.connect();

        setTimeout(() => {
            console.log(filterExtension);
            return res.json(filterExtension)
        }, 300);
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

    // const { extension, IPPabx, port, user, password } = req.query;
    //     console.log(req.query);
    //     let responsee;
    //     const ami = new amiI(port, IPPabx, user, password);

    //     ami.keepConnected();
        
    //     ami.connect();
    //     ami.action({
    //         'action': 'ExtensionState',
    //         'context': 'ippbx-from-extensions',
    //         'exten': extension,
    //         'actionid': '1',
    //     }, function(err, ress) {
    //         console.log(ress);
    //         responsee = ress
    //      });


    //     setTimeout(() => {
    //         ami.disconnect();

    //         return res.json(responsee)
    //     }, 100);
    // }