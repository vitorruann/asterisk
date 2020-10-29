import React, { useEffect, useState } from 'react';

import api from '../../services/api';
// import { Container } from './styles';
let control = 'off';

function Status({ history }) {
  const [allExtension, setAllExtension] = useState([]);
  const [finalExtension, setFinalExtension] = useState([]);
  const [consulta, setConsulta] = useState([]);
  const backend = [];

  let timer;
  
  useEffect(() =>{
    async function loadAllExtension() {

      const response = await api.get('/sipPeers', {
        params: {
          IPPabx: history.location.state.IPPabx,
          port: history.location.state.port,
          user: history.location.state.user,
          password: history.location.state.password
        }
      });

      setAllExtension(response.data);
      

    }       
    loadAllExtension();

  },[
    history.location.state.IPPabx, 
    history.location.state.port, 
    history.location.state.user, 
    history.location.state.password
  ]);
    
  async function reloadState() {
    timer = setInterval(async () => {
      const response = await api.get('/extensionStatus', {
        params: {
          extension: consulta,
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

  async function handleStartStop() {
    handleSubmit();
    if (control === 'off') {
      control = 'on';
    } else {
      control = 'off';
    }

    reloadState();
  };


  function handleSubmit() {
    allExtension.map(e => {
      if (e.exten) {
        backend.push({
          exten: e.exten
        })  
      }
      return backend;
    });
    setConsulta(backend);
    setFinalExtension(backend);
    console.log(finalExtension)
  };

  return (
    <div>
      <div>
          <label>Monitoramento Extensões</label>
          <br />
          
          <button type="button" onClick={handleSubmit}>Buscar extensões</button>
          <button type="button" onClick={handleStartStop}>{control === "on" ? 'Parar' : 'Iniciar'}</button>
      </div>
      
      <div>
        <h1>Status dos ramais</h1>

        {finalExtension.map(fe =>(
          <div key={fe.actionid}>
            <label>Extensão: {fe.exten}</label>
            <br/>
            <label>Status: {fe.status}</label>
          </div>
        ))}

      </div>

      <div>
        <h1>Todas extensões</h1>

        {allExtension.map(e => (
          <div key={e.exten}>
            <label>Rm: {e.exten} IP: {e.host} Porta: {e.portExten}</label>
          </div>
        ))}
        <br/>
      </div>
    </div>

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