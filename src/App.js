import React from 'react';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import AdminLayout from './layouts/Admin'
import AuthLayout from './layouts/Auth'

import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import StoreContext, {RootStore} from './stores/RootStore'

import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";

const history = createBrowserHistory();


function App() {
  return (
    <StoreContext.Provider value={RootStore}>
      <DndProvider backend={Backend}>
        <Router history={history}>
          <Switch>
            <Route path="/auth" component={AuthLayout}/>
            <Route path="/admin" component={AdminLayout}/>
            <Redirect from="/" to="/admin/dashboard" />
          </Switch>
        </Router>
      </DndProvider>
    </StoreContext.Provider>
  );
}

export default App;
