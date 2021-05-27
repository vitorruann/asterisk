import amiI from 'asterisk-manager';
import http from 'http';

let verify = 0;
import http from 'http';
// 5030, '10.1.43.12', 'admin', 'ippbx'
class actionsController {

    /**ROTA PARA ENCONTRAR AS EXTENSION*/
    async actionHints(req, res) {
        const { IPPabx, port, user, password } = req.query;
        const ami = new amiI(port, IPPabx, user, password);
        const arrayExtensions = [];
        const response = [];

        /**
         * Abrimos a conexão com o AMI e realizamos o comando core show hints para pegar todas as extensões locais
         * Adicionamos o retorno deste comando no array denominado "response"
         */
        ami.action({
            'action': 'Command',
            'command': 'core show hints',
            'actionid': '3',
        }, function(err, ress) {
            console.log(ress, 'a')
            response.push(ress) 
        });

        /**
         * Setamos um TimeOut para dar tempo da action ser completada, pois o comando pode trazer muitas linhas.
         */
        setTimeout(() => {
            ami.disconnect();
            try {
                console.log(response);
                let separaDados;
            /** 
            * Dentro o retorno do comando "core show hints" a linha: "- 10 hints registered" reresenta a quantidade 
            * de extensões encontradas. Para achar essa linha e pegarmos a quantidade de extensões encontradas, procuramos por:
            * "- xx" ou seja, tentamos encontrar uma barra, que após ela tenha um espaço em branco e em seguida qualquer
            * número de até 5 dígitos, para isso usamos a expressão match(/-\s[0-9]{0,5}/)[0], o retorno dessa procura é 
            * algo como "'- 10'", no caso de ter encontrado 10 extensões. Para limpar este retorno e ficarmos apenas com 
            * os números, utilizamos a expressão match(/[0-9]{1,5}/). Depois colocamos essa informação dentro da constante 
            * "quantLinhas". Lambrando que isso tudo é feito após transformar o retorno que vem em JSON para string
            * */       
                let achaQuantidade = JSON.stringify(response).match(/-\s[0-9]{0,5}/)[0];
                achaQuantidade = JSON.stringify(achaQuantidade).match(/[0-9]{1,5}/);
                const quantLinhas = Number(achaQuantidade);
            /**
             * Para limpar o conteudo e pegar somente as informações uteis a estratégia foi encontrar o local do "=-" na string e
             * adicionar mais 4 posições. A soma de 4 é para não pegar o "=-/n" e depois encontramos a expressão "--" e diminuimos 
             * 140 para retirar os caracteres que não precisamos (é tudo isso por que tem muito espaço em branco).
             * 
             * A entrada é algo como:
             * -= Registered Asterisk Dial Plan Hints =-                 <-(PEGAMOS ESSE INDEXOF)
             * 0123456789@ippbx-from-extension: SIP/0123456789        State:Unavailable     Watchers  0\n
             * 4004@ippbx-from-extension: SIP/4004              State:Unavailable     Watchers  0\n
             * ----------------                                          <-(E ESSE INDEXOF)
             * - 8 hints registered
             * 
             * Depois de limpar fica:
             * 0123456789@ippbx-from-extension: SIP/0123456789        State:Unavailable     Watchers  0
             * 4004@ippbx-from-extension: SIP/4004              State:Unavailable     Watchers  0
             */
                let indexIni = JSON.stringify(response).indexOf("=-") + 4
                let indexFim = JSON.stringify(response).indexOf("--") - 140

                let arrayFinal = JSON.stringify(response).substr(indexIni, indexFim)

                console.log(arrayFinal ,quantLinhas)
            
                /**
                 * Depois de limpar os dados, é feito um laço de repetição com referência a quantidade que pegamos 
                 * anteriormente, separamos cada linha da string em um array, para isso usamos a função 
                 * split(/\\n/g) onde "\n" seria a quebra de linha. Armazenamos o retorno em um array chamado "linha"
                 * 
                 * Depois dentro de cada linha, retiramos os espaços a mais utilizando a operação replace(/\s(?=\s)/g, "")
                 * onde "\s" representa um espaço e (?=\s) outros quaisquer quantidade de espaço depois do primeiro espaço,
                 * e subistituimos isso por nada, representado por "".
                 * 
                 * Depois de tirar os espaços, separamos os dados de cada linha, a separação procura qualquer aparecimento de
                 * "\s", "@", ",", ":" e "/".
                 * 
                 * A entrada dos dados nessa parte é algo como:
                 * 4004@ippbx-from-extension: SIP/4004 State:Unavailable Watchers 0
                 * 5050@ext-local : SIP/5050,CustomPrese State:Unavailable Presence:not_set Watchers 0
                 * 
                 * A saída NAS CIP'S ficam:
                 * ['', '4004', 'ippbx-from-extension', '', 'SIP', '4004', 'State', 'Unavailable', 'Watchers', '0']
                 * 
                 * A saída NO ISSABEL fica:
                 * ['5050', 'ext-local', '', '', 'SIP', '5050', 'CustomPrese', 'State', 'Unavailable', 'Presence', 'not_set', 'Watchers', '0']
                 * 
                 * Como temos situações diferente para cada produto, realizamos um if e else if para tratarmos dirente
                 * quando for CIP ou ISSABEL. No caso do ISSABEL, os dados importantes são os que estão nas posições
                 * 0, 1, 4 e 7. No caso das CIP's o importe são os dados 1, 2, 4 e 7
                 */
                let linha = [];

                for (let i = 0; i < quantLinhas;i++) {
                    linha = arrayFinal.split(/\\n/g);
                    separaDados = linha[i].replace(/\s(?=\s)/g, "");
                    separaDados = separaDados.split(/[\s@,:/]/g);
                    console.log(separaDados)
                    
                    if (separaDados[0] !== '' && separaDados[1] === 'ext-local') {
                        arrayExtensions.push({
                            exten: separaDados[0],
                            context: separaDados[1],
                            type: separaDados[4],
                            status: separaDados[7]
                        });
                    } 
                    else if(separaDados[2] === 'ippbx-from-extension'){
                        arrayExtensions.push({
                            exten: separaDados[1],
                            context: separaDados[2] + 's',
                            type: separaDados[4],
                            status: separaDados[7]
                        });
                    }
                }
            } catch (error) {
                return res.json(error)
            }

            /**
             * Ao final da tratativa temos o resultado:
             * CIP's
             * { exten: '4004', context: 'ippbx-from-extension', type: 'SIP', status: 'Idle'},
             * 
             * Issabel
             * { exten: '5050', context: 'ext-local', type: 'SIP', status: 'State' }.
             * 
             * Porém, nas CIPs a primeira posição do array é um número padrão que não deve ser mostrado,
             * então é feito um if para retirar a primeira posição, caso seja encontrado o número específico
             * na primeira posição do array
             */
            if (arrayExtensions[0].exten === '0123456789') {
                arrayExtensions.shift()
            }
            console.log(arrayExtensions);
            // console.log(response)
            return res.json(arrayExtensions.reverse())
        }, 100);
    }

    //********************************************************************************************************************** */
    /**ROTA PARA ENCONTRAR O STATUS DE CADA EXTENSION */
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
            ami.action({
                'action': 'ExtensionState',
                'context': exten.context,
                'exten': exten.exten,
                'actionid': '1',
            }, function(err, ress) {
                console.log(ress)
                response.push(ress)
            });
        });

        

        setTimeout(() => {
            ami.disconnect();
            return res.json(response)
        }, 300);
    }

    //********************************************************************************************************************** */
    /**ROTA PARA ENCONTRAR IP E PORTA DA EXTENSION (NÃO ESTÁ SENDO UTILIZADA NESTE MOMENTO)*/
    async actionSipPeers(req, res) {
        const { IPPabx, port, user, password } = req.query;
        console.log(req.query);

        const allExtension = [];
        
        const ami = new amiI(port, IPPabx, user, password)
        // ami.keepConnected();

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
        }, 100);
    }


}

export default new actionsController();