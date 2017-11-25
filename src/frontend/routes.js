import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
//Layouts
import Layout from './common/containers/Layout.jsx';
//containers
import List from './modules/phones/containers/List.jsx';
import Login from './common/containers/Login.jsx';

export default (user = null) => {
    function requireAuth(nextState, replace) {
        if (!user) {
            replace({
                pathname: '/'
            })
        }
    }
    function hasLogin(nextState, replace) {
        if (user && user.ext_id) {
            replace({
                pathname: '/phones'
            })
        }
    }

    return (
        <Route path='/' component={Layout}>
            <IndexRoute component={Login} onEnter={hasLogin} />
            <Route path='/phones' onEnter={requireAuth}>
                <IndexRoute component={List} />
            </Route>
        </Route>
    )
}
