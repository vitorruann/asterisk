import React from 'react';
import { Form, Input } from '@rocketseat/unform';

function Home({ history }) {
    function handleSubmit(data) {
        history.push('/status', data);
    }

    return (
        <div>
        <Form onSubmit={handleSubmit}>
          <Input name="IPPabx" type="text" placeholder="Dígite o IP do PABX"/>
          <Input name="port" type="text" placeholder="Dígite a porta do Maneger"/>
          <Input name="user" type="text" placeholder="Dígite o usuário de acesso"/>
          <Input name="password" type="password" placeholder="Dígite a senha de acesso"/>

          <button type="submit">Entrar</button>
        </Form>
      </div>
    );
}

export default Home;