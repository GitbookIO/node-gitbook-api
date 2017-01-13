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

});
