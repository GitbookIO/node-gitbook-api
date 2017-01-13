const expect = require('expect');
const GitBookAPI = require('../src');

describe('Client', () => {

    it('should return json response', () => {
        const client = new GitBookAPI();

        return client.get('book/gitbookio/documentation')
        .then((details) => {
            expect(details.id).toBe('gitbookio/documentation');
        });
    });

    it('should return GitBookError', () => {
        const client = new GitBookAPI();

        return client.get('nonexistant')
        .then(
            (details) => {
                throw new Error('It should have failed');
            },
            (err) => {
                expect(err).toBeA(GitBookAPI.Error);
                expect(err.statusCode).toBe(404);
                expect(err.code).toBe(404);
            });
    });

});
