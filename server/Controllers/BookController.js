const BookService = require("./../Services/BookService");
const BookRepository = require("./../Repositories/BookRepository");

class BookController {
    static inject = ["BookRepository", "BookService", "TranslateService"];
    constructor(repository, bookService, translateService) {
        /**
         * @type {BookRepository}
         */
        this.repository = repository;
        /**
         * @type {BookService}
         */
        this.bookService = bookService;
        this.translateService = translateService;

        this.getBook = this.getBook.bind(this);
        this.getAllBooks = this.getAllBooks.bind(this);
        this.createBook = this.createBook.bind(this);
    }

    async getBook(req, res) {
        const id = Number(req.params.id);
        const lang = req.query.language;
        const book = await this.repository.getById(id);
        const bookTranslated = await this.translateService.withBookTranslation(book, lang);
        return res.status(200).send(bookTranslated);
    }

    async getAllBooks(req, res) {
        const lang = req.query.language;
        const books = await this.repository.getAll();
        const booksTranslated = await this.translateService.withBookTranslation(books, lang);
        return res.status(200).send(booksTranslated);
    }

    async createBook(req, res) {
        try {
            const newBook = await this.bookService.create(req);
            return res.status(201).send(newBook);
        } catch (err) {
            if (err.name = "BAD_RESPONSE_ERROR") {
                return res.status(400).send({
                    fields: err.fields,
                    message: err.message,
                });
            }
            return res.status(500).send({});
        }
    }
}

module.exports = BookController;
