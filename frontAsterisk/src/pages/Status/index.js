import React, { useEffect, useState } from 'react';
import { Input } from '@rocketseat/unform';
import { io } from 'socket.io-client';

import api from '../../services/api';
import { Container, Header, StatusExten, BoxStatus, BoxDetails, Phone } from './styles';
import IconTele from '../../assets/telefonista.svg'

import { 
  MdRefresh, MdPlayCircleOutline, MdPauseCircleOutline, MdPhone, MdCallEnd, MdSettingsPhone, MdKeyboardBackspace, 
  MdExpandLess,
  MdExpandMore,
  MdChevronLeft,
  MdChevronRight,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

let controlStartStop = true;
let controlDisable = true;

const socket = io('http://10.1.31.92:3335');
console.log(socket);

function Status({ history }) {
  const [finalExtension, setFinalExtension] = useState([]);
  const [initialExtension, setInitialExtension] = useState([]);
  const [aditionalInfos, setAditionalInfos] = useState([]);
  const [numbFinal, setNumbFinal] = useState('');
  const [typeCall, setTypeCall] = useState(null);

  let timer;

  useEffect(() =>{
    console.log(typeCall);

    socket.on('statusCall', (data) => {
      console.log(data)
      setNumbFinal(data.numberID);
      setTypeCall(data.typeCall);
    })

    if (typeCall === 'endCall') {
      setNumbFinal('');
    }
  },[typeCall])

  useEffect(() =>{
    function defaultFunc() {
      loadAllExtension();
    }     

    defaultFunc();
  },[]);

  async function loadAllExtension() {
    const response = await api.get('/sipHints', {
      params: {
        IPPabx: history.location.state.IPPabx,
        port: history.location.state.port,
        user: history.location.state.user,
        password: history.location.state.password
      }
    });

    if (JSON.stringify(response.data) !== "{}") {
      controlDisable = false;
      setFinalExtension(response.data);
      setInitialExtension(response.data);
    } 
    else {
      controlDisable = true;
      alert('Erro ao carregar extensões');
      setFinalExtension([]);
    }

    const response2 = await api.get('/sipPeers', {
      params: {
        IPPabx: history.location.state.IPPabx,
        port: history.location.state.port,
        user: history.location.state.user,
        password: history.location.state.password
      }
    });
    
    setAditionalInfos(response2.data);
  }

  async function handleSubmit() {
    loadAllExtension();
  };

  async function handleStartStop() {
    if (controlStartStop === true) {
      controlStartStop = false;
      reloadState();
      
    } else {
      controlStartStop = true;

      setTimeout(() => {
        setFinalExtension(initialExtension);
      }, 4010);
    }
  };

  async function reloadState() {
    timer = setInterval(async () => {

      const response = await api.get('/extensionStatus', {
        params: {
          extension: finalExtension,
          IPPabx: history.location.state.IPPabx,
          port: history.location.state.port,
          user: history.location.state.user,
          password: history.location.state.password
        }
      });

      response.data.map(re => {
        if (re.status === '-1') {
          re.status = 'Ramal não enco.';
        } else if (re.status === '0') {
          re.status = 'Ramal livre';
        } else if (re.status === '1') {
          re.status = 'Ramal em uso';
        } else if (re.status === '2') {
          re.status = 'Ramal ocuapdo';
        } else if (re.status === '4') {
          re.status = 'Ramal indis.';
        } else if (re.status === '8') {
          re.status = 'Ramal ringando';
        } else if (re.status === '16') {
          re.status = 'Ramal em espera';
        }

        finalExtension.map(fExt => {
          if (fExt.exten === re.exten) {
            re.type = fExt.type
          }
          return fExt
        });

        aditionalInfos.map(adExt => {
          console.log(adExt.exten)
          if (adExt.exten === re.exten) {
            re.host = adExt.host
            re.port = adExt.portExten
          }
          return adExt
        });

        return response.data
      });
      setFinalExtension(response.data)

      if (controlStartStop === true) {
        clearInterval(timer);
      }
    }, 4000);
  };

  async function hangOut() {
    const response = await api.get('/sipCall', {
      params: {
        userPhone: 'admin',
        passwordPhone: 'admin', 
        ipPhone: '10.1.43.131',
        action: 'hangOut'
      }
    });

    setNumbFinal('');
    console.log(response);
  }
  

  async function makeACall() {
    //http://admin:admin@192.168.1.101/cgi-bin/ConfigManApp.com?key=SPEAKER;21060006;OK

    if (typeCall === 'incomingCall') {
      const response = await api.get('/sipCall', {
        params: {
          userPhone: 'admin',
          passwordPhone: 'admin', 
          ipPhone: '10.1.43.131',
          action: 'hangUp'
        }
      });
      
      console.log(response);
    } else {

      const response = await api.get('/sipCall', {
        params: {
          userPhone: 'admin',
          passwordPhone: 'admin', 
          ipPhone: '10.1.43.131',
          numbToCall: numbFinal,
          action: 'makeACall'
        }
      });

      console.log(response);
    }
  }

  function addNumbToCall(data) {
    if (typeof(data) === 'object') {
      if (data.nativeEvent.data) {
        data = numbFinal + data.nativeEvent.data;
      } else if(data.nativeEvent.inputType === 'deleteContentBackward') {
        data = numbFinal.substring(numbFinal.length - 1, numbFinal.length);
      }
    } else {
      data = numbFinal + data;
    }
    setNumbFinal(data);
  }

  function removeNumbToCall() {
    const data = numbFinal.substring(0, numbFinal.length - 1);

    setNumbFinal(data);
  }

  async function transferCall() {
    const response = await api.get('/sipCall', {
      params: {
        userPhone: 'admin',
        passwordPhone: 'admin', 
        ipPhone: '10.1.43.131',
        numbToCall: numbFinal,
        action: 'transferCall'
      }
    });

    console.log(response);
  }
  



  return (
    <Container class="container">
      <Header>
          <img src={IconTele} alt="" />
          <div>
            <h2>Mesa operadora</h2>
          </div>
      </Header>

      <div class="row">
        <div class="col-3">
          <div class="Titulos">
            <MdSettingsPhone size={30} />
            <h5>Desenvolvimento futuro</h5>
          </div> 

          <div >
            <Phone>
              <h1>Phone</h1>

                <Input className='display' name="numbToCall" type="text" onChange={addNumbToCall} value={numbFinal}/>

                <div>
                  <button className='keyPhone' onClick={() => transferCall()}>Flash</button>
                  <button className='keyPhone' onClick={() => transferCall()}>DND</button>
                  <button className='keyPhone' onClick={() => removeNumbToCall()}><MdKeyboardBackspace size={22}></MdKeyboardBackspace></button>
                </div>

                <div className='divVol'>
                  <div>
                    <MdAddCircleOutline type="button" size={30} color='#00CC88'></MdAddCircleOutline>
                  </div>
                  <div>
                    <button className='directions' onClick={() => transferCall()}><MdExpandLess size={25} color="#000"></MdExpandLess></button>
                  </div>
                  
                  <div>
                    <button className="keyVol" onClick={() => transferCall()}>L1</button>
                  </div>
                </div>
                
                <div>
                  <button className='directions' onClick={() => transferCall()}><MdChevronLeft size={25} color="#000"></MdChevronLeft></button>
                  <button className='directions' onClick={() => transferCall()}>OK</button>
                  <button className='directions' onClick={() => transferCall()}><MdChevronRight size={25} color="#000"></MdChevronRight></button>
                </div>

                <div className='divVol'>
                  <div>
                    <MdRemoveCircleOutline type="button" size={30} color='#ff0000'></MdRemoveCircleOutline>
                  </div>

                  <div>
                    <button className='directions' onClick={() => transferCall()}><MdExpandMore size={25} color="#000"></MdExpandMore></button>
                  </div>

                  <div >
                    <button className="keyVol" onClick={() => transferCall()}>L2</button>
                  </div>
                </div>

                <div>
                  <Input className='keyPhone' name="n1"type="button" value="1" onClick={() => addNumbToCall("1")}/>
                  <Input className='keyPhone' name="n2"type="button" value="2" onClick={() => addNumbToCall("2")}/>
                  <Input className='keyPhone' name="n3"type="button" value="3" onClick={() => addNumbToCall("3")}/>
                </div>

                <div>
                <Input className='keyPhone' name="n4"type="button" value="4" onClick={() => addNumbToCall("4")}/>
                <Input className='keyPhone' name="n5"type="button" value="5" onClick={() => addNumbToCall("5")}/>
                <Input className='keyPhone' name="n6"type="button" value="6" onClick={() => addNumbToCall("6")}/>
                </div>      

                <div>
                  <Input className='keyPhone' name="n7"type="button" value="7" onClick={() => addNumbToCall("7")}/>
                  <Input className='keyPhone' name="n8"type="button" value="8" onClick={() => addNumbToCall("8")}/>
                  <Input className='keyPhone' name="n9"type="button" value="9" onClick={() => addNumbToCall("9")}/>
                </div>        
                
                <div>
                  <Input className='keyPhone' name="n*"type="button" value="*" onClick={() => addNumbToCall('*')}/>
                  <Input className='keyPhone' name="n0"type="button" value="0" onClick={() => addNumbToCall("0")}/>
                  <Input className='keyPhone' name="n#"type="button" value="#" onClick={() => addNumbToCall('#')}/>
                </div>

                <div>
                  <button onClick={() => transferCall()}>Mute</button>
                  <button onClick={() => transferCall()}>RD</button>
                </div>

                <div>
                  <button onClick={makeACall}>
                    <MdPhone type="button"  size={35} color={typeCall === 'incomingCall' ? '#ff9d5f' : '#00CC88' && typeCall === 'endCall' ? '#00CC88': '#000' && typeCall === 'inCall' ? '#ff0000' : '#00CC88'}></MdPhone>
                  </button>

                  <button onClick={hangOut}>
                    <MdCallEnd size={35} color='#ff0000'></MdCallEnd>
                  </button>
                </div>
                
            </Phone>
          </div>

        </div>

        <div class="col-6 col-sm-9 col-md-9">
          <div class="Titulos">
            <MdPhone size={30} color="#000" />
            <h5>Status dos ramais</h5>
          </div>
          <StatusExten>
            <ul>  
              {finalExtension.map(fe =>(
                <div>
                  <div className="Status">
                    <BoxStatus key={fe.actionid} status={fe.status} >
                      <label>{fe.exten}</label>
                      <label>{fe.status}</label>
                    </BoxStatus>
                    
                    <div id="Details">
                      <BoxDetails typeExten={fe.type}>
                        <label>Tipo: {fe.type}</label>
                        <label>IP: {fe.host}</label>
                        <label>Porta: {fe.port}</label>
                      </BoxDetails>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
            <button class="bt1" type="button" onClick={handleSubmit}><MdRefresh size={30} color="#000"/></button>
            <button type="button" onClick={handleStartStop} 
              disabled={controlDisable ? true:false}>
              {
                controlStartStop ? 
                <MdPlayCircleOutline size={30} color={controlDisable ? "#ddd" : "#000"}/> :
                <MdPauseCircleOutline size={30} color="#000"/>
              }
            </button>
          </StatusExten>
        </div>
      </div>
    </Container>
  );
}

export default Status;

// async function hangUp() {
//   const response = await api.get('/sipHangUp', {
//     params: {
//       userPhone: 'admin',
//       passwordPhone: 'admin', 
//       ipPhone: '10.1.43.131',
//     }
//   });

//   setTypeCall('inCall')
//   console.log(response);
// };




// switch (extension.status) {
//   case '-1':
//     setStatus({
//       ramal: extension.exten,
//       status: 'Ramal não encontrado'
//     });
//     break;

//     case '0':
//     setStatus({
//       ramal: extension.exten,
//       status: 'Ramal livre'
//     });
//     break;

//     case '1':
//     setStatus({
//       ramal: extension.exten,
//       status: 'Ramal em uso'
//     });
//     break;

//     case '2':
//     setStatus({
//       ramal: extension.exten,
//       status: 'Ramal ocuapdo'
//     });
//     break;
    
//     case '4':
//     setStatus({
//       ramal: extension.exten,
//       status: 'Ramal em indisponível'
//     });
//     break;

//     case '8':
//     setStatus({
//       ramal: extension.exten,
//       status: 'Ramal em ringando'
//     });
//     break;

//     case '16':
//     setStatus({
//       ramal: extension.exten,
//       status: 'Ramal em espera'
//     });
//     break;

//   default:
//     setStatus({
//       ramal: extension.exten,
//       status: 'Ramal não encontrado 2'
//     });
//     break;
//   }

  // useEffect(() => {
  //   async function loadExtensions() {
  //     console.log(history.location.state);
  //     const response = await api.get('/extensionStatus', {
  //       params: {
  //         extension: '5017',
  //         IPPabx: '10.1.43.12',
  //         port: 5030,
  //         user: 'admin',
  //         password: 'ippbx'
  //       }
  //     });

  //     if (response.data.status === '-1') {
  //       response.data.status = 'Ramal não encontrado';
  //     }
      
  //     setExtension(response.data);
  //   }

  //   loadExtensions();
  // },[]);


  // timer = setInterval(async () => {
  //   const response = await api.get('/extensionStatus', {
  //     params: {
  //       extension: data.extension,
  //       IPPabx: history.location.state.IPPabx,
  //       port: history.location.state.port,
  //       user: history.location.state.user,
  //       password: history.location.state.password
  //     }
  //   });

  //   if (response.data.status === '-1') {
  //     response.data.status = 'Ramal não encontrado';
  //   } else if (response.data.status === '0') {
  //     response.data.status = 'Ramal livre';
  //   } else if (response.data.status === '1') {
  //     response.data.status = 'Ramal em uso';
  //   } else if (response.data.status === '2') {
  //     response.data.status = 'Ramal ocuapdo';
  //   } else if (response.data.status === '4') {
  //     response.data.status = 'Ramal indisponível';
  //   } else if (response.data.status === '8') {
  //     response.data.status = 'Ramal ringando';
  //   } else if (response.data.status === '16') {
  //     response.data.status = 'Ramal em espera';
  //   }

  //   console.log('de novo')
  //   setExtension(response.data);

  //   console.log(control)


  //   if (control === 'off') {
  //     clearInterval(timer);
  //   }

  // }, 5000);