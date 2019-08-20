import React from 'react'

import './table-row.css'

const TableRow = ({short, long, created, clicks }) => {
    return (
        <div className="table-row">
            <div className="cell short"><a href={short} target="_blank" rel="noopener noreferrer">{short}</a></div>
            <div className="cell long"><a href={long} target="_blank" rel="noopener noreferrer">{long}</a></div>
            <div className="cell">{created}</div>
            <div className="cell">{clicks}</div>
        </div>
    );
};

export default TableRow;
