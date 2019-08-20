import React from 'react'

import './url-list.css'
import LinksTable from '../url-table'
import Header from "../header";
import { Redirect } from 'react-router-dom';
import API from '../../services/api'

const UrlList = () => {
    const loggedIn = new API().loggedIn();
    return (
        loggedIn ? (
                <React.Fragment>
                    <Header />
                    <LinksTable />
                </React.Fragment>
            ) :
            (
                <Redirect path="/"/>
            )

    );
};

export default UrlList
