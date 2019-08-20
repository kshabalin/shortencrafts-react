import React from 'react'

import './table-row.css'

const TableRow = ({countryCode, country, date, shortUrl, longUrl}) => {
    return (
        <div className="table-row">
            <div className="cell">
                <div className="flag">
                    <img width="20" heigth="20" alt={country}
                         src={`https://www.countryflags.io/${countryCode}/flat/32.png`}/>
                </div>
                <span>{country}</span>
            </div>
            <div className="cell">{date}</div>
            <div className="cell short">
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
            </div>
            <div className="cell long">
                <a href={longUrl} target="_blank" rel="noopener noreferrer">{longUrl}</a>
            </div>
        </div>
    );
};

export default TableRow;
