import React,  { Component } from 'react';

import './shortener.css';
import LongLink from '../long-link';
import ShortenerService from '../../services/shortener-service'
import API from '../../services/api'

export default class Shortener extends Component {

    shortenerService = new ShortenerService();
    api = new API();

    state = {
        value: '',
        longUrl: ''
    };

    onValueChange = (e) => {
        this.setState({
            value: e.target.value,
            longUrl: ''
        })
    };

    shorten = async (e) => {
        e.preventDefault();
        const value = this.state.value;
        const url_hash = this.shortenerService.getShorten(value);
        const link = await this.api.shorten(url_hash, value);

        if (link) {
            this.setState({
                longUrl: value,
                value: link.short
            });
        } else {
            alert("Failed to shorten a link! Something went wrong!");
        }

    };

    copy = (e) => {
        e.preventDefault();
        const copyText = document.getElementById("long-input");
        copyText.select();
        document.execCommand("copy");
    };

    render() {

        const {longUrl} = this.state;

        const shortenForm = longUrl ? <ShortenForm value={this.state.value}
                                                   onSubmit={this.copy}
                                                   onChange={this.onValueChange}
                                                   buttonValue="Copy"
                                                   longLink={<LongLink url={longUrl}/>}/> :
                                      <ShortenForm value={this.state.value}
                                                   onSubmit={this.shorten}
                                                   onChange={this.onValueChange}
                                                   buttonValue="Shorten"/>;


        return (
            <section className="main">
                <div className="container content-container">
                    <div className="shorten-container">
                        {shortenForm}
                    </div>
                </div>
            </section>
        );
    }
};

const ShortenForm = ({onSubmit, onChange, value, buttonValue, longLink}) => {
    return (
        <React.Fragment>
            <form className="shorten-form" onSubmit={onSubmit}>
                <input id="long-input" className="text-input long-url-input"
                       type="text"
                       placeholder="Paste URL here"
                       onChange={onChange}
                       value={value}
                />
                <button className="long-url-button gradient">{buttonValue}</button>
            </form>
            {longLink}
        </React.Fragment>
    );
};
