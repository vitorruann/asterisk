import React, { useState, useEffect } from 'react';
import { Form, Input } from '@rocketseat/unform';

import api from '../../services/api';
// import { Container } from './styles';

function Status() {
  const [extension, setExtension] = useState([]);

  // useEffect(() => {
  //   async function loadExtensions() {
  //     const response = await api.get('/extensionStatus', {
  //       params: {
  //         extension: '2000',
  //         IPPabx: '192.168.0.21',
  //         port: 5038,
  //         user: 'admin',
  //         password: '171017'
  //       }
  //     });

  //     if (response.data.status === '-1') {
  //       response.data.status = 'Ramal não encontrado';
  //     }
      
  //     setExtension(response.data);
  //   }

  //   loadExtensions();
  // },[]);

  async function handleSubmit(data) {
    const response = await api.get('/extensionStatus', {
      params: {
        extension: data.extension,
        IPPabx: data.IPPabx,
        port: data.port,
        user: data.user,
        password: data.password
      }
    });

    if (response.data.status === '-1') {
      response.data.status = 'Ramal não encontrado';
    }
    
    setExtension(response.data);
  }

  return (
    <div>
      <div>
        <Form onSubmit={handleSubmit}>
        <Input name="IPPabx" type="text" placeholder="Dígite o IP do PABX"/>
        <Input name="port" type="text" placeholder="Dígite a porta do Maneger"/>
        <Input name="user" type="text" placeholder="Dígite o usuário de acesso"/>
        <Input name="password" type="password" placeholder="Dígite a senha de acesso"/>

        <Input name="extension" type="text" placeholder="Dígite o número do ramal"/>
        <button type="submit">Verificar</button>
      </Form>
      </div>
      
      <div>
        <h1>Status dos ramais</h1>

        <label>Ramal: {extension.exten}</label>
        <br/>
        <label>Status: {extension.status}</label>

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