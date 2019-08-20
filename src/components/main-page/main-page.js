import React from 'react'

import Shortener from '../shortener';
import Header from '../header';

const MainPage = (props) => {
    const loggedIn = props.location.state !== undefined &&
                     props.location.state.loggedIn !== undefined ?
                     props.location.state.loggedIn : false;
    return (
        <React.Fragment>
            <Header loggedIn={loggedIn}/>
            <Shortener />
        </React.Fragment>
    );
};

export default MainPage
