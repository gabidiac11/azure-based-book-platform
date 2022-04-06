const { Translate } = require('@google-cloud/translate').v2;

class TranslateService {
    static inject = ["Configuration"];
    constructor(config) {
        this.translate = new Translate({ keyFilename: config.get("GC_KEY_FILENAME") });

        this.withBookTranslation = this.withBookTranslation.bind(this);
        this.translateBook = this.translateBook.bind(this);
    }

    async withBookTranslation(bookOrBooks, language) {
        if (!language) {
            language = "en";
        }

        if (Array.isArray(bookOrBooks)) {
            const books = bookOrBooks;
            for (let i = 0; i < books.length; i++) {
                books[i] = await this.translateBook(books[i], language)
            }
            return books
        }
        return await this.translateBook(bookOrBooks, language);
    }

    async translateBook(book, language) {
        book.title = await this.translate.translate(book.title, language);
        book.description = await this.translate.translate(book.description, language);

        book.title = book.title[0]
        book.description = book.description[0]
        return book
    }
}


module.exports = TranslateService;