import React, { useEffect, useState } from 'react';
import { Input } from '@rocketseat/unform';
import { io } from 'socket.io-client';

import api from '../../services/api';
import { Container, ContainerScroll, Header, StatusExten, BoxStatus, BoxDetails, Phone, StatusRegister } from './styles';
import IconTele from '../../assets/telefonista.svg'

import { 
  MdRefresh, MdPlayCircleOutline, MdPauseCircleOutline, MdPhone, MdCallEnd, MdSettingsPhone, MdKeyboardBackspace, 
  MdExpandLess,
  MdExpandMore,
  MdChevronLeft,
  MdChevronRight,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
  MdMicOff,
  MdLoop,
  MdBlock,
} from 'react-icons/md';
import ScrollBar from 'react-perfect-scrollbar';

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
  const [infoPhone, setInfoPhone] = useState({modelPhone: 'Intelbras', statusPhone: ''});
  const [DND, setDND] = useState('DNDON');


  let timer;

  useEffect(() =>{
    console.log(typeCall);

    socket.on('modelPhone', (data) => {
      setInfoPhone(data);
    })

    socket.on('statusCall', (data) => {
      console.log(data);
      setNumbFinal(data.numberID);
      setTypeCall(data.typeCall);
      if (typeCall === 'endCall') {
        setNumbFinal('');
      }
    });


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

  async function callActions(transferCall) {
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
    } 
    else if(typeCall === 'inCall') {
      if (transferCall) {
        
        const response = await api.get('/sipCall', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            numbToCall: numbFinal,
            action: 'transferCall'
          }
        });
    
        setNumbFinal('');
        console.log(response);
      } 
      else {
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
    } 
    else {

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

  async function PhoneFunctions(functionCall) {
    let response = '';
    console.log(functionCall);
    switch (functionCall) {
      case 'DND':
        if (DND === 'DNDON') {
          setDND('DNDOFF')

          console.log(DND)
          response = await api.get('/sipFunctions', {
            params: {
              userPhone: 'admin',
              passwordPhone: 'admin', 
              ipPhone: '10.1.43.131',
              functionCall: 'DNDON',
            }
          });
          console.log(response);
        } 

        else if('DNDOFF') {
          setDND('DNDON')

          response = await api.get('/sipFunctions', {
            params: {
              userPhone: 'admin',
              passwordPhone: 'admin', 
              ipPhone: '10.1.43.131',
              functionCall: 'DNDOFF',
            }
          });
          console.log(response);
        }
        break;

      case 'VOLUME_UP':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);
        break;
        
      case 'UP':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);
        break;   

      case 'DSS1':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);
        break;

      case 'LEFT':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);
        break;

      case 'OK':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);        
        break;

      case 'RIGHT':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);  
        break;

      case 'VOLUME_DOWN':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);  
        break;

      case 'DOWN':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);  
        break;

      case 'DSS2':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);  
        break;

      case 'MUTE':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);  
        break;

      case 'RD':
        response = await api.get('/sipFunctions', {
          params: {
            userPhone: 'admin',
            passwordPhone: 'admin', 
            ipPhone: '10.1.43.131',
            functionCall
          }
        });
  
        console.log(response);  
        break;

      default:
        break;
    }
  }
  



  return (
    <Container class="container">
      <Header>
          <img src={IconTele} alt="" />
          <div>
            <h2>Mesa operadora</h2>
          </div>
      </Header>

      <ContainerScroll class="row">
        <div class="col-3 ContainerPhone">
          <div class="Titulos">
            <MdSettingsPhone size={30} />
            <h5>Terminais Linha V</h5>
          </div> 


          <div >
            <Phone>
              <StatusRegister status={infoPhone.statusPhone}>{infoPhone.modelPhone}</StatusRegister>

                <Input className='display' name="numbToCall" type="text" onChange={addNumbToCall} value={numbFinal}/>

                <div>
                  <button className='keyPhone' onClick={() => callActions(true)}>Flash</button>
                  <button className='keyPhone' onClick={() => PhoneFunctions('DND')}><MdBlock size={22} color={DND === 'DNDON' ? '#00CC88' : '#ff6961'}></MdBlock></button>
                  <button className='keyPhone' onClick={() => removeNumbToCall()}><MdKeyboardBackspace size={22}></MdKeyboardBackspace></button>
                </div>

                <div className='divVol'>
                  <div>
                    <MdAddCircleOutline type="button" onClick={() => PhoneFunctions('VOLUME_UP')} size={30} color='#00CC88'></MdAddCircleOutline>
                  </div>
                  <div>
                    <button className='directions' onClick={() => PhoneFunctions('UP')}><MdExpandLess size={25} color="#000"></MdExpandLess></button>
                  </div>
                  
                  <div>
                    <button className="keyVol" onClick={() => PhoneFunctions('DSS1')}>L1</button>
                  </div>
                </div>
                
                <div>
                  <button className='directions' onClick={() => PhoneFunctions('LEFT')}><MdChevronLeft size={25} color="#000"></MdChevronLeft></button>
                  <button className='directions' onClick={() => PhoneFunctions('OK')}>OK</button>
                  <button className='directions' onClick={() => PhoneFunctions('RIGHT')}><MdChevronRight size={25} color="#000"></MdChevronRight></button>
                </div>

                <div className='divVol'>
                  <div>
                    <MdRemoveCircleOutline type="button" onClick={() => PhoneFunctions('VOLUME_DOWN')} size={30} color='#ff6961'></MdRemoveCircleOutline>
                  </div>

                  <div>
                    <button className='directions' onClick={() => PhoneFunctions('DOWN')}><MdExpandMore size={25} color="#000"></MdExpandMore></button>
                  </div>

                  <div >
                    <button className="keyVol" onClick={() => PhoneFunctions('DSS2')}>L2</button>
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
                  <button onClick={() => PhoneFunctions('MUTE')}><MdMicOff size={30} color="#ff6961"></MdMicOff></button>
                  <button onClick={() => PhoneFunctions('RD')}><MdLoop size={30}></MdLoop></button>
                </div>

                <div>
                  <button onClick={() => callActions(false)}>
                    <MdPhone type="button"  size={35} color={typeCall === 'incomingCall' ? '#ff9d5f' : '#00CC88' && typeCall === 'endCall' ? '#00CC88': '#000' && typeCall === 'inCall' ? '#ff0000' : '#00CC88'}></MdPhone>
                  </button>

                  <button onClick={() => callActions(false)}>
                    <MdCallEnd size={35} color='#ff0000'></MdCallEnd>
                  </button>
                </div>
                
            </Phone>
          </div>

        </div>

        <div class="col-6 col-sm-9 col-md-9 ContainerPhone">
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
      </ContainerScroll>
    </Container>
  );
}

export default Status;