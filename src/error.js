
/**
 * API error object.
 * @type {Class}
 */
class GitBookError extends Error {
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;
        this.statusCode = 0;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }

    get code() {
        return this.statusCode;
    }

    /**
     * Create an error object for a fetch response.
     * @param  {Response} response
     * @return {Promise<GitBookError>} rejected promise
     */
    static createForResponse(response) {
        return response.json()
        .then((json) => {
            const error = new GitBookError(json.error);
            error.statusCode = json.code || 0;
            error.response = response;

            return Promise.reject(error);
        });
    }
}

module.exports = GitBookError;
