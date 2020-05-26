import React, { Component } from 'react'

import './signup.css'
import SignUpLogin from '../signup-login'
import UserInput from '../user-input'
import API from '../../services/api'
import { Redirect } from 'react-router-dom';

export default class SignUp extends Component {
    api = new API();

    state = {
        signedUp: false,
        username: '',
        email:'',
        password: '',
        passwordConfirmation: ''
    };

    onUsernameChanged = (e) => {
        this.setState({
            username: e.target.value
        })
    };

    onEmailChanged = (e) => {
        this.setState({
            email: e.target.value
        })
    };

    onPasswordChanged = (e) => {
        this.setState({
            password: e.target.value
        })
    };

    onPasswordConfirmationChanged = (e) => {
        this.setState({
            passwordConfirmation: e.target.value
        })
    };

    onSubmit = async (e) => {
        e.preventDefault();
        const {username, email, password, passwordConfirmation} = this.state;
        const res = await this.api.signup({
                                            username: username,
                                            email: email,
                                            password: password,
                                            password_confirmation: passwordConfirmation
                                        });
        const {data: {succeeded, msg}} = res;
        let message;
        if (succeeded === true) {
            this.setState({
                signedUp: true
            });
            message = `Success! ${msg || ''} You can login with credentials provided on registration.`;
        } else {
            message = msg || "Registration failed!"
        }
        alert(message)
    };

    render() {
        return (
            this.state.signedUp || this.api.loggedIn() ?
                (
                    <Redirect to="/"/>
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
                                   type="text"
                                   name="email"
                                   placeholder="Email"
                                   onChange={this.onEmailChanged}
                                   value={this.state.email}/>
                        <UserInput className="user-form-input"
                                   type="password"
                                   name="password"
                                   placeholder="Password"
                                   onChange={this.onPasswordChanged}
                                   value={this.state.password}/>
                        <UserInput className="user-form-input"
                                   type="password"
                                   name="password_confirmation"
                                   placeholder="Retype password"
                                   onChange={this.onPasswordConfirmationChanged}
                                   value={this.state.passwordConfirmation}/>
                        <UserInput className="submit" type="submit" value="Sign in"/>
                    </SignUpLogin>
                )

        )
    }
};
