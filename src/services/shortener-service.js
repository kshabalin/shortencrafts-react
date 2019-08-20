import md5 from 'md5';

export default class ShortenerService {

    _keyLength = 6;

    validateUrl = (url) => {
        return /(https?|ftp):\/\/(-\.)?([^\s/?.#-]+\.?)+(\/[^\s]*)?$/.test(url)
    };

    getShorten = (url) => {
        const encoded = md5(this._removePrefix(url));
        return encoded.substring(0, this._keyLength);
    };

    _removePrefix = (url) => {
        return url.replace(/(^\w+:|^)\/\//, '');
    };
}
