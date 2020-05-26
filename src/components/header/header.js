import React, { Component } from 'react';

import { Link, NavLink } from 'react-router-dom';
import Logo from '../logo';
import API from '../../services/api'

import './header.css';

export default class Header extends Component {
    api = new API();

    state = {
        expanded: false
    };

    onBarsClicked = () => {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }));
        // const x = document.getElementById("nav");
        //
        // if (x.className === "nav") {
        //     x.className += " responsive";
        // } else {
        //     x.className = "nav";
        // }
    };

    render() {
        const menuClass = `nav ${this.state.expanded ? "responsive" : ""}`;
        const menu = this.props.loggedIn || this.api.loggedIn() ?
            (
                <>
                    <NavLink to="/click-list" className="nav-link" activeClassName="nav-link-active">Clicks</NavLink>
                    <NavLink to="/url-list" className="nav-link" activeClassName="nav-link-active">My Urls</NavLink>
                    <NavLink to="/logout" className="nav-link" activeClassName="nav-link-active">Logout</NavLink>
                </>
            ) :
            (
                <>
                    <NavLink to="/login" className="nav-link" activeClassName="nav-link-active">Login</NavLink>
                    <NavLink to="/signup" className="nav-link" activeClassName="nav-link-active">Sign Up</NavLink>
                </>
            );
        return (
            <header className="header">
                <div className="container">
                    <div className="inner-header">
                        <div className="header-logo">
                            <Link to="/">
                                <Logo />
                            </Link>
                        </div>
                        <nav id="nav" className={menuClass}>
                            {menu}
                        </nav>
                        <a href="#" className="icon" onClick={this.onBarsClicked}>
                            <i className="fa fa-bars fa-3x"></i>
                        </a>
                    </div>
                </div>
            </header>
        )
    }
};
