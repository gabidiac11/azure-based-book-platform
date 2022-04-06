class BookService {
    static inject = ["BookRepository", "StorageService"];
    constructor(repository, storageService) {
        this.repository = repository;
        this.storageService = storageService;

        this.extractBookFromReq = this.extractBookFromReq.bind(this);
        this.create = this.create.bind(this);
    }

    extractBookFromReq(req) {
        const book = {
            title: String(req.body.title || ""),
            description: String(req.body.description || ""),
            author: String(req.body.author || ""),
            publishedDate: String(req.body.publishedDate || ""),
        };

        const _errors = {};
        Object.entries(book).forEach(([name, value]) => {
            if (!value) {
                _errors[name] = "Field required";
                return;
            }
            if (value === "error") {
                _errors[name] = "Field with invalid name (just a test)";
                return;
            }
        });

        if (Object.keys(_errors).length) {
            throw {
                name: "BAD_RESPONSE_ERROR",
                fields: _errors,
            };
        }

        return book;
    }

    async create(req) {
        const bookReq = this.extractBookFromReq(req);

        console.log("file is.....", req.file)
        /**
         * file is..... {
            fieldname: 'imgFile',
            originalname: '270189919_946235549355050_8080336268379794759_n.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 02 00 00 01 00 01 00 00 ff e2 01 d8 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 01 c8 6c 63 6d 73 02 10 00 00 ... 52474 more bytes>,
            size: 52524
          }
         */
        const imgUrl = await this.storageService.upload(req.file);
        const newBook = await this.repository.create(bookReq, imgUrl);
        return newBook;
    }
}

module.exports = BookService;
