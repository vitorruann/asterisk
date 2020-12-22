import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import { Container, Header, StatusExten, BoxStatus, InfoExten, InfoBox, BoxDetails } from './styles';
import IconTele from '../../assets/telefonista.svg'

import { MdRefresh, MdPlayCircleOutline, MdPauseCircleOutline, MdPhone, MdSettingsPhone } from 'react-icons/md';

let controlStartStop = true;
let controlDisable = true;

function Status({ history }) {
  const [finalExtension, setFinalExtension] = useState([]);
  const [initialExtension, setInitialExtension] = useState([]);
  const [aditionalInfos, setAditionalInfos] = useState([]);

  let timer;

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