import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import './index.css';
import AdminLayout from './layouts/Admin'
import AuthLayout from './layouts/Auth'

import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";


const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={Backend}>
    <Router history={history}>
      <Switch>
        <Route path="/auth" component={AuthLayout}/>
        <Route path="/admin" component={AdminLayout}/>
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </Router>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
