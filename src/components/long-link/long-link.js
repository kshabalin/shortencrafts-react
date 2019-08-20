import React from 'react'

import './long-link.css';

const LongLink = ({url}) => {
    return (
        <span className="long-url">
            <a href={url.includes('http://') || url.includes('https://') ? url : `https://${url}`}
               target="_blank" rel="noopener noreferrer">{url}</a> shortening
        </span>
    );
};

export default LongLink;
