const GitBookAPI = require('../src');

describe('Book', () => {

    it('should correctly get infos about a book', () => {
        const client = new GitBookAPI();
        const book = client.book('gitbookio/documentation');

        return book.info()
        .then((details) => {
            details.id.should.equal('gitbookio/documentation');
        });
    });

    it('should correctly list books', () => {
        const client = new GitBookAPI();
        return client.books('all')
        .then((r) => {
            r.list.should.be.an.Array();
        });
    });

});
