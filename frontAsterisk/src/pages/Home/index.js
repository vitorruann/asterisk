import React from 'react';
import { Form, Input } from '@rocketseat/unform';

import IconTele from '../../assets/telefonista.svg'

import { Container, Content } from './styles';

function Home({ history }) {
    function handleSubmit(data) {
        history.push('/status', data);
    }

    return (
      <Container>
        <Content>
          <div className="iconTele">
            <img src={IconTele} alt="" />
          </div>

          <Form onSubmit={handleSubmit}>
            <label>IP PABX: </label>
            <Input name="IPPabx" type="text" placeholder="Dígite o IP do PABX"/>
            <label>Porta maneger: </label>
            <Input name="port" type="text" placeholder="Dígite a porta do Maneger"/>
            <label>Usuário maneger: </label>
            <Input name="user" type="text" placeholder="Dígite o usuário de acesso"/>
            <label>Senha maneger: </label>
            <Input name="password" type="password" placeholder="Dígite a senha de acesso"/>

            <button type="submit">Entrar</button>
          </Form>
        </Content>
      </Container>
    );
}

export default Home;