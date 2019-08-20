import React from 'react';
import API from '../../services/api';
import { Redirect } from 'react-router-dom';

const Logout = () => {
    const api = new API();
    api.logout();
    return (<Redirect path="/"/>)
};

export default Logout