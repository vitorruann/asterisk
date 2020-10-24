import amiI from 'asterisk-manager';
import fs from 'fs';

const ami = new amiI(5030, '10.1.43.12', 'admin', 'ippbx');
// 5030, '10.1.43.12', 'admin', 'ippbx'
class actionsController {

    async actionExten(req, res) {
        let responsee;
   
        ami.connect();
        // ami.action({
        //     'action': 'ExtensionState',
        //     'context': 'ippbx-from-extensions',
        //     'exten': '5017',
        //     'actionid': '1'
        // }, function(err, ress) {
        //     // let data = fs.read(ress, 'utf8', function(err, data) {
        //     //     console.log(data);
        //     // })
        //     console.log(ress);
        //     console.log('5');
        // });
        ami.action({
            'action': 'Logoff',
        }, function(err, ress) {
            console.log('6');
            responsee = ress
        });
        
        
        console.log('7');
        setTimeout(() => {
            console.log('14');
            ami.disconnect();
            console.log(responsee)
            return res.json(responsee)
            }, 1500);
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
