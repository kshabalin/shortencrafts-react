import React from 'react'

import './click-list.css'
import ClicksTable from '../clicks-table'
import Header from "../header";
import { Redirect } from 'react-router-dom';
import API from '../../services/api'

const ClickList = () => {
    const loggedIn = new API().loggedIn();
    return (
        loggedIn ? (
            <React.Fragment>
                <Header />
                <ClicksTable />
            </React.Fragment>
            ) :
            (
                <Redirect path="/"/>
            )

    );
};

export default ClickList
