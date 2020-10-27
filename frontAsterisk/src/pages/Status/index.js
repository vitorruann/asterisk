import React, { useEffect, useState } from 'react';
import { Form, Input } from '@rocketseat/unform';

import api from '../../services/api';
// import { Container } from './styles';
let control = 'on';

function Status({ history }) {
  const [allExtension, setAllExtension] = useState([]);
  const [finalExtension, setFinalExtension] = useState([]);
  const extension = [];
  let timer;
  
  useEffect(() => {
    async function loadAllExtension() {
      const response = await api.get('/sipPeers', {
        params: {
          IPPabx: history.location.state.IPPabx,
          port: history.location.state.port,
          user: history.location.state.user,
          password: history.location.state.password
        }
      });
      console.log(response)
      setAllExtension(response.data);
    }

    loadAllExtension();
  },[finalExtension]);


  async function handleSubmit(data) {
    console.log(finalExtension)
  };


  async function handleStop() {
    console.log('Stop!!');
    if (control === 'off') {
      control = 'on';
    } else {
      control = 'off';
    }
    timer = setInterval(() => {

    allExtension.map(async e => {
      console.log(e)
      const response = await api.get('/extensionStatus', {
        params: {
          extension: e.exten,
          IPPabx: history.location.state.IPPabx,
          port: history.location.state.port,
          user: history.location.state.user,
          password: history.location.state.password
        }
      });
  
      if (response.data.status === '-1') {
        response.data.status = 'Ramal não encontrado';
      } else if (response.data.status === '0') {
        response.data.status = 'Ramal livre';
      } else if (response.data.status === '1') {
        response.data.status = 'Ramal em uso';
      } else if (response.data.status === '2') {
        response.data.status = 'Ramal ocuapdo';
      } else if (response.data.status === '4') {
        response.data.status = 'Ramal indisponível';
      } else if (response.data.status === '8') {
        response.data.status = 'Ramal ringando';
      } else if (response.data.status === '16') {
        response.data.status = 'Ramal em espera';
      }

      console.log('de novo')
      // setExtension(response.data);
      extension.push({
        exten: response.data.exten,
        status: response.data.status
      });
      console.log(control)
    });


      if (control === 'off') {
        clearInterval(timer);
      }

    }, 5000);
    console.log(control)
    setFinalExtension(extension)
  };


  // const timer = setInterval(handleTest, time);

  // function handleTest() {
  //   console.log('a')
  // }

  return (
    <div>
      <div>
        <Form onSubmit={handleSubmit}>
          <label>Dígite o número do ramal</label>
          <br />
          <Input name="extension" type="text" placeholder="Dígite o número do ramal"/>
          <br />
          
          <button type="submit">Iniciar</button>
          <button type="button" onClick={handleStop}>Parar</button>
        </Form>
      </div>
      
      <div>
        <h1>Status dos ramais</h1>

        {finalExtension.map(fe =>(
          <div>
            <label>Extensão: {fe.exten}</label>
            <br/>
            <label>Status: {fe.status}</label>
          </div>
        ))}

      </div>

      <div>
        <h1>Todas extensões</h1>

        {allExtension.map(e => (
          <div>
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