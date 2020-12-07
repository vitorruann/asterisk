import amiI from 'asterisk-manager';
let verify = 0;
// 5030, '10.1.43.12', 'admin', 'ippbx'
class actionsController {

    async actionExtenStatus(req, res) {
        const { extension, IPPabx, port, user, password } = req.query;
        const data = [];
        const response = [];
        const ami = new amiI(port, IPPabx, user, password);
        // ami.keepConnected();

        ami.connect();

        /** formatação dos dados que vem do frontend, aproveitamos apenas exten e context para fazer a action ExtensionState
            Dados chegam: '{"exten":"9003","context":"ippbx-from-extension","tipo":"SIP","status":"Unavailable"}',
            Tratados ficam:   { exten: '9003', context: 'ippbx-from-extension' },
            os dados tratados são armazenados no array "data" que depois é mapeado para realizar a action de cada extensão
         */
        extension.map(ex =>{
            ex = ex.toString().replace(/['{"}]/g, "").split(/[,:]/g);

            data.push({
                exten: ex[1],
                context: ex[3]
            }); 
        });

        data.map(exten => {

            if (exten.exten) {
                ami.action({
                    'action': 'ExtensionState',
                    'context': exten.context + 's',
                    'exten': exten.exten,
                    'actionid': '1',
                }, function(err, ress) {
                    console.log(ress)
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

            if ((evt.response === 'Success' && evt.context === 'from-internal') || (evt.response === 'Success' && evt.context === 'ippbx-from-extensions')) {
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
                if ((ress.response === 'Success' && ress.context === 'from-internal') || (ress.response === 'Success' && ress.context === 'ippbx-from-extensions')) {
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

    async teste(req, res) {
        const { IPPabx, port, user, password } = req.query;
        const ami = new amiI(5038, '10.1.43.11', 'admin', 'ippbx');
        const response = [];

        ami.on('managerevent', function(evt) {
            console.log(evt.response);
        });

        ami.action({
            'action': 'Command',
            'command': 'core show hints',
            'actionid': '3',
        }, function(err, ress) {
            console.log(ress)
            response.push(ress) 
        });

        setTimeout(() => {
            ami.disconnect();
            try {
                console.log(response);
                let separaDados;
            let achaQuantidade = JSON.stringify(response).match(/-\s[0-9]{0,5}/)[0];
            achaQuantidade = JSON.stringify(achaQuantidade).replace(/-\s/g, '').replace('"', "").replace('"', "");
            const quantLinhas = Number(achaQuantidade) -1;
            let indexIni = JSON.stringify(response).indexOf("Watchers  0") + 32
            let indexFim = JSON.stringify(response).indexOf("--") - 262

            let arrayFinal = JSON.stringify(response).substr(indexIni, indexFim)


            console.log(arrayFinal.trim(), quantLinhas)

            let arrayExtensoes = [];
            let linha = [];

            for (let i = 0; i < quantLinhas;i++) {
            linha = arrayFinal.split(/\\n/g);
            separaDados = linha[i].replace(/\s(?=\s)/g, "");
            separaDados = separaDados.split(/[\s@,:/]/g);
            
            if (i === 0) {
                arrayExtensoes.push({
                    exten: separaDados[0],
                    context: separaDados[1],
                    tipo: separaDados[3],
                    status: separaDados[6]
                });
            } else {
                arrayExtensoes.push({
                    exten: separaDados[1],
                    context: separaDados[2],
                    type: separaDados[4],
                    status: separaDados[7]
                });
            }
            
            }
            } catch (error) {
                return res.json(error)
            }
            
            
            console.log(arrayExtensoes);
            // console.log(response)
            return res.json(arrayExtensoes)
        }, 300);
    }
}


export default new actionsController();

//-------------------------------------------SIPPEERS-------------------------------------------
/**
action: sippeers

Response: Success
Message: Peer status list will follow

Event: PeerEntry
Channeltype: SIP
ObjectName: Juntor_403
ChanObjectType: peer
IPaddress: 10.1.43.12
IPport: 5060
Dynamic: no
Natsupport: yes
VideoSupport: yes
ACL: no
Status: Unmonitored
RealtimeDevice: no

Event: PeerEntry
Channeltype: SIP
ObjectName: Juntor402
ChanObjectType: peer
IPaddress: 10.1.43.12
IPport: 5060
Dynamic: no
Natsupport: yes
VideoSupport: yes
ACL: no
Status: Unmonitored
RealtimeDevice: no

Event: PeerEntry
Channeltype: SIP
ObjectName: Juntor
ChanObjectType: peer
IPaddress: 10.1.43.12
IPport: 5060
Dynamic: no
Natsupport: yes
VideoSupport: yes
ACL: no
Status: Unmonitored
RealtimeDevice: no

Event: PeerEntry
Channeltype: SIP
ObjectName: 400
ChanObjectType: peer
IPaddress: 10.1.43.12
IPport: 5060
Dynamic: no
Natsupport: yes
VideoSupport: yes
ACL: no
Status: Unmonitored
RealtimeDevice: no

Event: PeerEntry
Channeltype: SIP
ObjectName: Ramal_205
ChanObjectType: peer
IPaddress: -none-
IPport: 5060
Dynamic: yes
Natsupport: yes
VideoSupport: yes
ACL: no
Status: Unmonitored
RealtimeDevice: no

Event: PeerEntry
Channeltype: SIP
ObjectName: Ramal204
ChanObjectType: peer
IPaddress: -none-
IPport: 5060
Dynamic: yes
Natsupport: yes
VideoSupport: yes
ACL: no
Status: Unmonitored
RealtimeDevice: no

Event: PeerEntry
Channeltype: SIP
ObjectName: Ramal
ChanObjectType: peer
IPaddress: -none-
IPport: 5060
Dynamic: yes
Natsupport: yes
VideoSupport: yes
ACL: no
Status: Unmonitored
RealtimeDevice: no

Event: PeerEntry
Channeltype: SIP
ObjectName: 202
ChanObjectType: peer
IPaddress: 10.1.24.156
IPport: 5060
Dynamic: yes
Natsupport: yes
VideoSupport: yes
ACL: no
Status: Unmonitored | UNKNOWN | UNREACHABLE | OK (3 ms)
RealtimeDevice: no

Event: PeerlistComplete
ListItems: 8

*/

//-------------------------------------------ISIP/SIP SHOW PEER-------------------------------------------
/**
action: sipshowpeer
peer: 202

Response: Success
Channeltype: SIP
ObjectName: 202
ChanObjectType: peer
SecretExist: Y
MD5SecretExist: N
Context: ippbx-from-extensions
Language: pt_BR
AMAflags: Unknown
CID-CallingPres: Presentation Allowed, Not Screene
Callgroup:
Pickupgroup:
VoiceMailbox: 202@ippbx-from-extension
TransferMode: open
LastMsgsSent: 0
Call-limit: 100
MaxCallBR: 384 kbps
Dynamic: Y
Callerid: "202" <202>
RegExpire: 12153 seconds
SIP-AuthInsecure: port,invite
SIP-NatSupport: Always
ACL: N
SIP-CanReinvite: Y
SIP-PromiscRedir: N
SIP-UserPhone: N
SIP-VideoSupport: Y
SIP-Sess-Timers: Accept
SIP-Sess-Refresh: uas
SIP-Sess-Expires: 1800
SIP-Sess-Min: 90
SIP-DTMFmode: info
SIPLastMsg: 0
ToHost:
Address-IP: 10.1.24.156
Address-Port: 5060
Default-addr-IP: 0.0.0.0
Default-addr-port: 5060
Default-Username: 202
Codecs: 0x10c (ulaw|alaw|g729)
CodecOrder: g729,alaw,ulaw
Status: Unmonitored
SIP-Useragent:
Reg-Contact : sip:202@10.1.24.156:5060
*/

//-------------------------------------------EXTENSIONSTATE-------------------------------------------
/**
action: extensionstate
context: ippbx-from-extension
exten: 400

Response: Success
Message: Extension Status
Exten: 400
Context: ippbx-from-extension
Hint:
Status: -1 (Ramal não encontrado) | 0 (Ramal livre)| 1 (Ramal em uso)| 
         2 (Ramal ocuapdo)| 4 (Ramal indisponível)| 8 (Ramal ringando)| 
         16 (Ramal em espera)
*/

//-------------------------------------------CORE SHOW HINTS-------------------------------------------
/**
cip850*CLI> core show hints
cip850*CLI>
-= Registered Asterisk Dial Plan Hints =-
0123456789@ippbx-from-extension: SIP/0123456789        State:Unavailable     Watchers  0
4004@ippbx-from-extension: SIP/4004              State:Unavailable     Watchers  0
4003@ippbx-from-extension: SIP/4003              State:Idle            Watchers  0
399@ippbx-from-extension: SIP/399               State:Unavailable     Watchers  0
600@ippbx-from-extension: Zap/1                 State:Unavailable     Watchers  0
401@ippbx-from-extension: SIP/401               State:Unavailable     Watchers  0
400@ippbx-from-extension: SIP/400               State:Idle            Watchers  0
501@ippbx-from-extension: Zap/2                 State:Unavailable     Watchers  0
----------------
- 8 hints registered


*/

//-------------------------------------------COMPARAÇÃO-------------------------------------------
/**
Ramais      Juntores
200         400
201         401
202         402
203         403
204
205

cip850*CLI> isip show peers
Name/username              Host            Dyn Nat ACL Port     Status
Juntor_403                 10.1.43.12           N      5060     Unmonitored
Juntor402                  10.1.43.12           N      5060     Unmonitored
Juntor/401                 10.1.43.12           N      5060     Unmonitored
400                        10.1.43.12           N      5060     Unmonitored
Ramal_205                  (Unspecified)    D   N      5060     Unmonitored
Ramal204                   (Unspecified)    D   N      5060     Unmonitored
Ramal                      (Unspecified)    D   N      5060     Unmonitored
202/202                    10.1.24.156      D   N      5060     Unmonitored
8 sip peers [Monitored: 0 online, 0 offline Unmonitored: 8 online, 0 offline]

cip850*CLI> core show hints
cip850*CLI>
-= Registered Asterisk Dial Plan Hints =-
0123456789@ippbx-from-extension: SIP/0123456789        State:Unavailable     Watchers  0
205@ippbx-from-extension: SIP/Ramal_205         State:Unavailable     Watchers  0
204@ippbx-from-extension: SIP/Ramal204          State:Unavailable     Watchers  0
203@ippbx-from-extension: SIP/Ramal             State:Unavailable     Watchers  0
202@ippbx-from-extension: SIP/202               State:Idle            Watchers  0
201@ippbx-from-extension: Zap/4                 State:Idle            Watchers  0
200@ippbx-from-extension: Zap/3                 State:Idle            Watchers  0
----------------
- 7 hints registered

cip850*CLI> isip show peer 400
  * Name       : 400
  Context      : ippbx-from-trunks
  ToHost       : 10.1.43.12
  Addr->IP     : 10.1.43.12 Port 5060
  Defaddr->IP  : 0.0.0.0 Port 5060
  Def. Username:
  Status       : Unmonitored
  Useragent    :
  Sess-Expires : 1800 secs

cip850*CLI> isip show peer 202
  * Name       : 202
  Context      : ippbx-from-extensions
  Mailbox      : 202@ippbx-from-extension
  VM Extension : asterisk
  Call limit   : 100
  Callerid     : "202" <202>
  Status       : Unmonitored
  Useragent    :
  Reg. Contact : sip:202@10.1.24.156:5060

cip850*CLI> isip show peer Ramal_205
cip850*CLI>

  * Name       : Ramal_205
  Context      : ippbx-from-extensions
  Mailbox      : 205@ippbx-from-extension
  Callerid     : "Ramal_205" <205>
  Addr->IP     : (Unspecified) Port 5060
  Defaddr->IP  : 0.0.0.0 Port 5060
  Def. Username:
  Status       : Unmonitored
  Useragent    :
  Reg. Contact : 

*/