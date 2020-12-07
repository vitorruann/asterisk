import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import { Container, Header, StatusExten, BoxStatus, InfoExten, InfoBox } from './styles';
import IconTele from '../../assets/telefonista.svg'

import { MdRefresh, MdPlayCircleOutline, MdPauseCircleOutline, MdPhone, MdSettingsPhone } from 'react-icons/md';

let control = 'off';
let findExten = 'off';

function Status({ history }) {
  const [allExtension, setAllExtension] = useState([]);
  const [finalExtension, setFinalExtension] = useState([]);
  const [filterExtension, setFilterExtension] = useState([]);
  const [consulta, setConsulta] = useState([]);
  const backend = [];

  let timer;
  
  useEffect(() =>{
    async function loadAllExtension() {

      // const response = await api.get('/sipPeers', {
      //   params: {
      //     IPPabx: history.location.state.IPPabx,
      //     port: history.location.state.port,
      //     user: history.location.state.user,
      //     password: history.location.state.password
      //   }
      // });

      const response2 = await api.get('/teste', {
        params: {
          IPPabx: history.location.state.IPPabx,
          port: history.location.state.port,
          user: history.location.state.user,
          password: history.location.state.password
        }
      });

      // setAllExtension(response.data);
      setFilterExtension(response2.data);
      return
    }      

    loadAllExtension();
  },[
    history.location.state.IPPabx, 
    history.location.state.port, 
    history.location.state.user, 
    history.location.state.password,
  ]);

  async function handleSubmit() {
    setFinalExtension(filterExtension)
    findExten = 'on';
    console.log(findExten)
  };

  async function handleStartStop() {
    if (control === 'off') {
      control = 'on';
    } else {
      control = 'off';
    }
    
    reloadState();
  };

  async function reloadState() {
    timer = setInterval(async () => {

      const response = await api.get('/extensionStatus', {
        params: {
          extension: filterExtension,
          IPPabx: history.location.state.IPPabx,
          port: history.location.state.port,
          user: history.location.state.user,
          password: history.location.state.password
        }
      });

      response.data.map(re => {
        if (re.status === '-1') {
          re.status = 'Ramal não encontrado';
        } else if (re.status === '0') {
          re.status = 'Ramal livre';
        } else if (re.status === '1') {
          re.status = 'Ramal em uso';
        } else if (re.status === '2') {
          re.status = 'Ramal ocuapdo';
        } else if (re.status === '4') {
          re.status = 'Ramal indisponível';
        } else if (re.status === '8') {
          re.status = 'Ramal ringando';
        } else if (re.status === '16') {
          re.status = 'Ramal em espera';
        }
        return response.data
      });
      
      setFinalExtension(response.data);

      if (control === 'off') {
        clearInterval(timer);
      }
    }, 5000);
  };


  return (
    <Container class="container">
      <Header>
          <img src={IconTele} alt="" srcset=""/>
          <div>
            <h2>Mesa operadora</h2>
          </div>
      </Header>

      <div class="row">
        <div class="col-3">

          <div class="Titulos">
            <MdSettingsPhone size={30} />
            <h5>Todas extensões</h5>
          </div>  

          <InfoExten >
            <ul>
              {allExtension.map(e => (
                <InfoBox key={e.exten}>
                  <strong>{e.exten}</strong>
                  <span>{e.host}</span>
                  <span>Porta: {e.portExten}</span>
                </InfoBox>
              ))}
            </ul>
          </InfoExten>
        </div>

        <div class="col-9">
          <div class="Titulos">
            <MdPhone size={30} color="#000" />
            <h5>Status dos ramais</h5>
          </div>
          <StatusExten>
            <ul>  
              {finalExtension.map(fe =>(
                <BoxStatus key={fe.actionid} status={fe.status} >
                  <label>{fe.exten}</label>
                  <label>{fe.status}</label>
                  <label>{fe.callID}</label>
                </BoxStatus>
              ))}
            </ul>
            <button class="bt1" type="button" onClick={handleSubmit}><MdRefresh size={30} color="#000"/></button>
            <button 
                type="button" 
                onClick={handleStartStop} 
                disabled={findExten === 'off' ? true : false 
              }>
              {control === "on" ? 
                <MdPauseCircleOutline size={30} color="#000"/> : 
                <MdPlayCircleOutline size={30} color={findExten === 'off' ? '#ccc' : '#000' 
                }/>
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