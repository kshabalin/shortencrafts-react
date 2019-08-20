import axios from 'axios';
import decode from 'jwt-decode';

export default class API {

    get = async (url, params) => {
        const res = await axios.get(
            url,
            {
                params: params,
                headers: {Authorization: this.getAuthHeader()}}
                );

        if (res.status !== 200) {
            throw new Error(`Could not fetch ${url}` +
                `, received ${res.status}`)
        }
        return res;
    };

    post = async (url, data) => {
        const res = await axios.post(
            url,
            data,
            {headers: {Authorization: this.getAuthHeader()}}
        );

        if (res.status !== 200 && res.status !== 201) {
            throw new Error(`Could not fetch ${url}` +
                `, received ${res.status}`)
        }
        return res;
    };

    shorten = async (short, long) => {
        try {
            const res = await this.post('/links', {link: {url_hash: short, url: long}});
            return this._transformLink(res.data.data);
        } catch (e) {
            console.log(`Failed to save shorten! ${e.message}`);
        }
    };

    login = async (email, password) => {
        try {
            const res = await axios.post('/signin', {auth: {email: email, password: password}});
            const {data: {jwt}} = res;
            this.setToken(jwt);
            return true;
        } catch (e) {
            console.log(`Incorrect login or password! ${e.message}`);
            return false;
        }
    };

    signup = async (user) => {
        try {
            await  axios.post('/signup', {user: user});
            return true;
        } catch (e) {
            console.log(`Failed to register new user! ${e.message}`);
            return false;
        }
    };

    loggedIn = () => {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    };

    isTokenExpired = token => {
        try {
            const decoded = decode(token);
            return decoded.exp < Date.now() / 1000;
        } catch (err) {
            console.log("Expired check failed!");
            return false;
        }
    };

    setToken = token => {
        localStorage.setItem("token", token);
    };

    getToken = () => {
        return localStorage.getItem("token");
    };

    getAuthHeader = () => {
        return this.loggedIn() ? `Beared ${this.getToken()}` : null
    };

    logout = () => {
        localStorage.removeItem("token");
    };

    getClicks = async (params) => {
        const result = await this.get(`/clicks`, params);
        const {data: {data, meta: {total}}} = result;
        const rows = data.map(this._transformClick);

        return {
            total: total,
            rows: rows
        }
    };

    getLinks = async (params) => {
        const result = await this.get(`/links`, params);
        const {data: {data, meta: {total}}} = result;
        const rows = data.map(this._transformLink);
        return {
            total: total,
            rows: rows
        }
    };

    _transformClick = (click) => {
        const {id, attributes} = click;
        return {
            id: id,
            country:     attributes.country,
            countryCode: attributes.countryCode,
            date:        attributes.date,
            shortUrl:    attributes.link.attributes.shortUrl,
            longUrl:     attributes.link.attributes.url
        }
    };

    _transformLink = (link) => {
        const {id, attributes} = link;
        return {
            id:        id,
            short:     attributes.shortUrl,
            long:      attributes.url,
            created:   attributes.createdAt,
            clicks:    attributes.clicks
        }
    }
}