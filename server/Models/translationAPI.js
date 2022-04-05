const {Translate} = require('@google-cloud/translate').v2;

const translate = new Translate({keyFilename: 'cloud-computing-2022-345016-ede0eee78aaa.json'});

const withTranslationAPI = async (books, language) => {

    for (let i = 0; i < books.length; i++) {
        books[i] = await translateBook(books[i],language)
    }
    return books
}

const translateBook = async (book, language) => {

    if(!language)
    {
        language = 'en'
    }

    book.title = await translate.translate(book.title, language);
    book.description = await translate.translate(book.description, language);

    book.title = book.title[0]
    book.description = book.description[0]

    return book
}

module.exports = {
    withTranslationAPI,
    translateBook
}