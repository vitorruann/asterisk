import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Status from './pages/Status';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/status' exact component={Status} />
      </Switch>
    </BrowserRouter>
  );
}