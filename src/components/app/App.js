import React, { Component } from 'react';
import './App.css';

import ClickList from '../click-list'
import UrlList from '../url-list'
import MainPage from '../main-page';
import Login from '../login';
import Logout from '../logout';
import SignUp from '../signup';

import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/" component={MainPage} exact />
                <Route path="/click-list" component={ClickList} />
                <Route path="/url-list" component={UrlList} />
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
                <Route path="/signup" component={SignUp} />
            </Router>
        )
    }
};


