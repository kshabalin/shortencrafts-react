import React, { Component }  from 'react'

import './login.css';
import SignUpLogin from '../signup-login'
import UserInput from '../user-input'
import { Redirect } from 'react-router-dom';
import API from '../../services/api'

export default class Login extends Component {

    api = new API();

    state = {
        loggedIn: false,
        username: '',
        password: ''
    };

    componentDidMount() {
        this.setState({
            loggedIn: this.api.loggedIn()
        });
    }

    onUsernameChanged = (e) => {
        this.setState({
            username: e.target.value
        })
    };

    onPasswordChanged = (e) => {
        this.setState({
            password: e.target.value
        })
    };

    onSubmit = async (e) => {
        e.preventDefault();
        const {username, password} = this.state;
        const res = await this.api.login(username, password);
        if (res === true) {
            this.setState({
                loggedIn: true
            });
        } else {
            alert("Incorrect username or password")
        }
    };

    render() {
        console.log(`loggedin ${this.state.loggedIn}`);
        return (
            this.state.loggedIn ?
                (
                    <Redirect to={{
                        pathname: "/",
                        state: {loggedIn: true}
                    }}/>
                ) :
                (
                    <SignUpLogin onSubmit={this.onSubmit}>
                        <UserInput className="user-form-input"
                                   type="text"
                                   name="username"
                                   placeholder="Username"
                                   onChange={this.onUsernameChanged}
                                   value={this.state.username}/>
                        <UserInput className="user-form-input"
                                   type="password"
                                   name="password"
                                   placeholder="Password"
                                   onChange={this.onPasswordChanged}
                                   value={this.state.password}/>
                        <UserInput className="submit" type="submit" value="Sign in"/>
                    </SignUpLogin>
                )

        )
    }
};
