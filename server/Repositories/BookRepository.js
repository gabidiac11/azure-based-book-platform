class BookRepository {
  static inject = ["Database"];
  constructor(db) {
    this.db = db;

    this.getById = this.getById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.create = this.create.bind(this);
  }

  async getById(id) {
    const query = `SELECT * FROM books WHERE bookId = ${id}`;
    const rows = await this.db.selectQuery(query);
    if (rows.length == 0) {
      throw {
        name: "BAD_RESPONSE_ERROR",
        code: 404,
      };
    }

    return {
      ...rows[0],
      publishedDate: rows[0].publishedDate.value,
    };
  }

  async getAll() {
    return await this.db.selectQuery("SELECT * FROM books");
  }

  async create(book, imgUrl) {
    const query = `INSERT INTO 
                                books(title, author, publishedDate, description, imgUrl) 
                                VALUES (?, ?, DATE_FORMAT(?, '%y-%m-%d'), ?, ?)`;
    const insertResults = await this.db.insertQuery(query, [
      book.title,
      book.author,
      book.publishedDate,
      book.description,
      imgUrl,
    ]);
    return this.getById(insertResults.insertId);
  }
}

module.exports = BookRepository;
