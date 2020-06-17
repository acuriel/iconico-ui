import React, {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';
import { observer } from "mobx-react";
import StoreContext from "stores/RootStore";


const PrivateRoute = ({ component: Component, ...rest }) => {
    const { authStore } = useContext(StoreContext);

    return (
    <Route {...rest} render={props => {
        if (!authStore.authenticated) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)}

export default observer(PrivateRoute);
