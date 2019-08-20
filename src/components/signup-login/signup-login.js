import React from 'react'

import './signup-login.css'
import Logo from "../logo";
import {Link} from "react-router-dom";

const SignUpLogin = (props) => {
    return (
        <section className="signup-login">
            <div className="container">
                <div className="login-form-container">
                    <div className="login-logo">
                        <Link to="/" >
                            <Logo />
                        </Link>
                    </div>
                    <form className="login-form" onSubmit={props.onSubmit}>
                        {props.children}
                    </form>
                </div>
            </div>
        </section>
    )
};

export default SignUpLogin
