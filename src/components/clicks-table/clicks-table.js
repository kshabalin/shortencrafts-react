import React, { Component }  from 'react'
import DatePicker from "react-datepicker";
import Autosuggest from 'react-autosuggest';

import API from '../../services/api'

import './clicks-table.css'
import "react-datepicker/dist/react-datepicker.css";
import TableRow from '../table-row'

import countries from './countries.json';

export default class ClicksTable extends Component {

    _api = new API();
    _slice = 5;

    state = {
        suggestions: [],
        data: {
            rows: [],
            pages: 1
        },
        params: {
            country: '',
            from: null,
            to: null,
            page: 0,
            size: 5
        }
    };

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : countries.filter(country =>
            country.name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    getSuggestionValue = suggestion => suggestion.name;

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    renderSuggestion = suggestion => (
        <div>
            {suggestion.name}
        </div>
    );

    componentDidMount() {
        this.loadData();
    }

    handlePageChange = e => {
        e.preventDefault();
        const input = e.currentTarget.value;
        let newPage;
        const {params: {page}, data: {pages}} = this.state;
        if (input === "...") {
            newPage = page + this._slice;
            newPage = newPage < pages ? newPage : pages;
        } else if (input === "»") {
            newPage = page < pages ? page + 1 : page;
        } else if (input === "«") {
            newPage = page > 0 ? page - 1 : 0;
        } else {
            newPage = input - 1;
        }
        this.updateParam({'page': newPage})
    };

    handlePageSizeInput = ({target: {value}}) => {
        this.updateParam({'size': value, 'page': 0})
    };

    handleCountryInput = (event, { newValue }) => {
        this.updateParam({'country': newValue})
    };

    handleDateFromInput = date => {
        this.updateParam({'from': date})
    };

    handleDateToInput = date => {
        this.updateParam({'to': date})
    };

    onFilterReset = async () => {
        const { params } = { ...this.state };

        params.country = '';
        params.from = null;
        params.to = null;
        params.page = 0;

        this.setState({ params: params });
        await this.loadData()
    };

    updateParam = async (newParams) => {
        const { params } = { ...this.state };
        const currentState = params;

        Object.entries(newParams).forEach(([name, value]) => {
            currentState[name] = value;
        });

        this.setState({ params: currentState });
        await this.loadData()
    };


    loadData = async () => {
        const {params, params: {size}} = this.state;
        const {total, rows} = await this._api.getClicks(params);
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

    renderPageBar = () => {
        const { data: { pages }, params: {page} } = this.state;
        const start = Math.floor(page / this._slice) * this._slice;
        const end = start + this._slice > pages ? pages : start + this._slice;
        const pageBar =  Array(pages).fill().map((_, i) => {
            const p = i + 1;
            return <button key={p} className={page === i ? "active" : ""}
                           onClick={this.handlePageChange} value={p}>{p}</button>;
        }).slice(start, end);
        if (end < pages - 1) {
            pageBar.push(<button key={end + 1} onClick={this.handlePageChange} value="...">...</button>);
        }
        return pageBar;
    };

    render() {
        const {suggestions, params: {country}} = this.state;

        const inputProps = {
            value: country,
            onChange: this.handleCountryInput
        };


        return (
            <section className="click-list">
                <div className="container">
                    <div className="statictics-container">

                        <div className="stats-filter-container">

                            <div className="filter country">
                                <label htmlFor="country">Country:</label>
                                <Autosuggest
                                    suggestions={suggestions}
                                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                    getSuggestionValue={this.getSuggestionValue}
                                    renderSuggestion={this.renderSuggestion}
                                    inputProps={inputProps}
                                />
                            </div>

                            <div className="filter datetime">
                                <label htmlFor="country">From:</label>
                                <DatePicker
                                    name="from"
                                    selected={this.state.params.from}
                                    className="filter-input"
                                    onChange={this.handleDateFromInput} />
                            </div>
                            <div className="filter datetime">
                                <label htmlFor="country">To:</label>
                                <DatePicker
                                    name="to"
                                    selected={this.state.params.to}
                                    className="filter-input"
                                    onChange={this.handleDateToInput} />
                            </div>

                            <div className="filter filter-reset">
                                <button className="filter-reset-button" onClick={this.onFilterReset}></button>
                            </div>

                        </div>

                        <div className="table-row table-header">
                            <div className="cell">Country</div>
                            <div className="cell">Date/Time</div>
                            <div className="cell">Short</div>
                            <div className="cell">Long</div>
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
        )
    }
}
