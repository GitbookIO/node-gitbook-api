var client = require('./client');

describe('Book', function() {

    it('should correctly get infos about a book', function() {
        var book = client.book('gitbookio/documentation')

        return book.info()
        .then(function(details) {
            details.id.should.equal('gitbookio/documentation');
        });
    });

});

