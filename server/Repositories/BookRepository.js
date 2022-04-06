
class BookRepository {
    static inject = ["Database"];
    constructor(db) {
        this.db = db;

        this.getById = this.getById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.create = this.create.bind(this);
    }

    async getById(id) {
        const query = `SELECT * FROM cloud-computing-2022-345016.books.Books WHERE bookId = ${id}`
        const rows = await this.db.executeQuery(query)
        if (rows.length == 0) {
            throw {
                name: "BAD_RESPONSE_ERROR",
                code: 404,
            };
        }

        return {
            ...rows[0],
            publishedDate: rows[0].publishedDate.value
        };
    }

    async getAll() {
        const query = `SELECT * FROM cloud-computing-2022-345016.books.Books`
        const rows = await this.db.executeQuery(query)
        const books = [];
        rows.forEach(row => row.publishedDate = row.publishedDate.value);
        rows.forEach(row => books.push(row));
        return books;
    }

    async create(book, imgUrl) {
        const maxId = await this.db.executeQuery("SELECT max(bookId) as id FROM cloud-computing-2022-345016.books.Books");
        const id = maxId[0].id + 1;

        const query = `INSERT INTO cloud-computing-2022-345016.books.Books VALUES (${id}, "${book.title}", "${book.author}", "${book.publishedDate}", "${book.description}", "${imgUrl}")`
        await this.db.executeQuery(query)
        return this.getById(id);
    };
}

module.exports = BookRepository;
