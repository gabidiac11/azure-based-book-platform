const BookRepository = require("../../Repositories/BookRepository");
const Database = require("../Database");
const booksMock = require("./booksMock");

class SeedService {
  static inject = ["Database", "BookRepository"];
  constructor(db, bookRepository) {
    /**
     * @type {Database}
     */
    this.db = db;
    /**
     * @type {BookRepository}
     */
    this.bookRepository = bookRepository;

    this.tableExists = this.tableExists.bind(this);
    this.createTablesIfNeeded = this.createTablesIfNeeded.bind(this);
    this.seed = this.seed.bind(this);
    this.seedBooks = this.seedBooks.bind(this);
    this.recreate = this.recreate.bind(this);
  }

  async seed() {
    await this.createTablesIfNeeded();
  }

  async tableExists(table) {
    const results = await this.db.selectQuery(`
    SELECT * FROM information_schema.tables
      WHERE table_name = '${table}'
    LIMIT 1;`);
    return !!results.length;
  }

  async createTablesIfNeeded() {
    if (!(await this.tableExists("books"))) {
      const query = `CREATE TABLE books (
                                bookId int PRIMARY KEY AUTO_INCREMENT, 
                                title TEXT,
                                author VARCHAR(255),
                                publishedDate DATE,
                                description TEXT,
                                imgUrl TEXT
      );`;
      await this.db.query(query);
      console.log("Books table doesn't exist so was created now...");

      await this.seedBooks();
    } else {
      console.log("No books seed or table creation needed for 'books'");
    }
  }

  async seedBooks() {
    for (const bookData of booksMock) {
      await this.bookRepository.create(bookData, bookData.imgUrl);
    }
    console.log("Books seeded.");
  }

  async recreate() {
    if (await this.tableExists("books")) {
      await this.db.query("DROP TABLE books");
      console.log("Books table dropped.");
    }
    await this.seed();
  }
}

module.exports = SeedService;
