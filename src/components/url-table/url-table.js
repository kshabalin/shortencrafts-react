import React, { Component } from 'react'

import './url-table.css'
import API from '../../services/api'
import TableRow from "../url-table-row";

export default class UrlTable extends Component {
    api = new API();

    state = {
        data: {
            rows: [],
            pages: 1
        },
        params: {
            page: 0,
            size: 5
        }
    };

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        const {params, params: {size}} = this.state;
        const {total, rows} = await this.api.getLinks(params);
        this.setState({
            data: {
                rows: rows,
                pages: Math.ceil(total / size)
            }
        })
    };

    renderRows = () => {
        const { data: {rows} } = this.state;
        return rows.map(
            (row) => <TableRow key={row.id} {...row} />)
    };

    handlePageChange = e => {
        e.preventDefault();
        const input = e.currentTarget.value;
        let newPage;
        if (input === "»") {
            const {params: {page}, data: {pages}} = this.state;
            newPage = page < pages - 1 ? page + 1 : page;
        } else if (input === "«") {
            const {page} = this.state.params;
            newPage = page > 0 ? page - 1 : 0;
        } else {
            newPage = input - 1;
        }
        this.updateParam('page', newPage)
    };

    handlePageSizeInput = ({target: {value}}) => {
        this.updateParam('size', value)
    };

    updateParam = async (name, value) => {
        const { params } = { ...this.state };
        const currentState = params;
        currentState[name] = value;

        this.setState({ params: currentState });
        await this.loadData()
    };

    renderPageBar = () => {
        const { data: { pages }, params: {page} } = this.state;
        return Array(pages).fill().map((_, i) => {
            const p = i + 1;
            return <button key={p} className={page === i ? "active" : ""}
                           onClick={this.handlePageChange} value={p}>{p}</button>;
        })
    };

    render() {
        return (
            <section className="click-list">
                <div className="container">
                    <div className="statictics-container">
                        <div className="table-row table-header">
                            <div className="cell">Short</div>
                            <div className="cell">Long</div>
                            <div className="cell">Created</div>
                            <div className="cell">Total clicks</div>
                        </div>

                        {this.renderRows()}

                        <div className="table-row table-bottom">
                            <div className="pagination">
                                <div className="page-bar">
                                    <button onClick={this.handlePageChange} value="&laquo;">&laquo;</button>
                                    {this.renderPageBar()}
                                    <button onClick={this.handlePageChange} value="&raquo;">&raquo;</button>
                                </div>
                                <div className="page-size">
                                    Page size:
                                    <select onChange={this.handlePageSizeInput} defaultValue="5">
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>
        );
    }
}
