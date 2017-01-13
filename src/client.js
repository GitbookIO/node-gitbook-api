const querystring = require('querystring');
const btoa = require('btoa');
const fetch = require('isomorphic-fetch');

const GitBookError = require('./error');
const defaultConfig = require('./defaultConfig');

/**
 * ApiClient is a helper class to make API requests
 * from React components using the user's token and the
 * API Secret as password for BasicAuth.
 *
 * @type {Class}
 */
class ApiClient {

    /**
     * Initialize a new API Client from configuration and a JSON encoded account
     *
     * @param  {Object} config
     * @param  {Object} account
     */
    constructor(account = {}, config = defaultConfig) {
        // config.apiHost and account.auth.token are used
        // to keep compatibility with GitBook.com payload.

        // Set base URL for requests
        this.endpoint = config.host || config.apiHost;

        // Set Basic Auth informations
        this.auth = (account && account.token) ?
            btoa(account.username + ':' + ((account.auth ? account.auth.token : account.token)) || '')
            : null;

        // Set common headers
        this.headers = {
            'Accept':        'application/json',
            'Content-Type':  'application/json',
            'Authorization': this.auth ? 'Basic ' + this.auth : undefined
        };
    }

    /**
     * Return true if api calls are authentified
     */
    isAuthenticated() {
        return Boolean(this.auth);
    }

    /**
     * enpointUrl returns the full targeted URL with API host and encoded querystring
     * @param  {String} url     Relative URL to API endpoint
     * @param  {Object} params  Object containing query string parameters to encode
     * @return {String}
     */
    endpointUrl(url, params) {
        url = url[0] == '/' ? url : '/' + url;
        return this.endpoint + url + (params ? '?' + querystring.stringify(params) : '');
    }

    /**
     * request executes the request to an API endpoint <url> with options <opts>
     * It returns a Promise providing the data from the response as a JS Object
     *
     * @param  {String} url
     * @param  {Object} opts  <opts> may contain the following properties:
     *                        - {String} method: HTTP method for the request
     *                        - {Object} data:   Body for the request to be encoded as JSON
     *                        - {Object} params: An Object containing the query string parameters to encode
     * @return {Promise}
     */
    request(url, opts) {
        // Default options
        opts = opts || {};

        // Configuration for fetch
        const headers = this.headers;
        const cfg = {
            method: opts.method || 'GET',
            headers
        };

        if (Boolean(opts.data)) {
            cfg.body = JSON.stringify(opts.data);
        }

        // Construct full URL
        url = this.endpointUrl(url, opts.params);

        return fetch(url, cfg)
        .then(response => this.parseResponse(response));
    }

    /**
     * delete is a shorthand method to send a DELETE HTTP request
     * See request description for more details about <url>, <params> and return type
     * @param  {String} url
     * @param  {Object} params
     * @return {Promise}
     */
    delete(url, params) {
        return this.request(url, {
            method: 'DELETE',
            params
        });
    }

    /**
     * get is a shorthand method to send a GET HTTP request
     * See request description for more details about <url>, <params> and return type
     * @param  {String} url
     * @param  {Object} params
     * @return {Promise}
     */
    get(url, params) {
        return this.request(url, {
            params
        });
    }

    /**
     * patch is a shorthand method to send a PATCH HTTP request
     * See request description for more details about <url>, <data>, <params> and return type
     * @param  {String} url
     * @param  {Object} params
     * @param  {Object} data
     * @return {Promise}
     */
    patch(url, data, params) {
        return this.request(url, {
            method: 'PATCH',
            data,
            params
        });
    }

    /**
     * post is a shorthand method to send a POST HTTP request
     * See request description for more details about <url>, <data>, <params> and return type
     * @param  {String} url
     * @param  {Object} params
     * @param  {Object} data
     * @return {Promise}
     */
    post(url, data, params) {
        return this.request(url, {
            method: 'POST',
            data,
            params
        });
    }

    /**
     * put is a shorthand method to send a PUT HTTP request
     * See request description for more details about <url>, <data>, <params> and return type
     * @param  {String} url
     * @param  {Object} params
     * @param  {Object} data
     * @return {Promise}
     */
    put(url, data, params) {
        return this.request(url, {
            method: 'PUT',
            data,
            params
        });
    }

    /**
     * parseResponse is responsible for handling the response to a fetch request
     * It checks that <response> was successfull and contains the correct Content-Type
     * It returns a Promise for trying to parse the encoded JSON body to a JS Object
     *
     * @param  {Response} response
     * @return {Promise}
     */
    parseResponse(response) {
        const contentType = response.headers.get('Content-Type');

        if (!response.ok) {
            return GitBookError.createForResponse(response);
        }

        if (contentType.indexOf('application/json') < 0) {
            throw new Error('Invalid content type for response');
        }

        return response.json();
    }
}

module.exports = ApiClient;
