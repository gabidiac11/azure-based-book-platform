const bigQuery = require("./bigQuery");
const cloudStorage = require("./cloudStorage");
const fs = require("fs");
const translate = require("./translationAPI")

const getBookFromBigQuery = async (id) => {
    const query = `SELECT * FROM cloud-computing-2022-345016.books.Books WHERE bookId = ${id}`
    const rows = await bigQuery.executeQuery(query)
    let book;
    if (rows.length == 0){
        throw {
            name: "BAD_RESPONSE_ERROR",
            code: 404,
        };        
    }
    book = rows[0]
    book.publishedDate = book.publishedDate.value;
    return book;
};

const getBooksFromBigQuery = async () => {
    const query = `SELECT * FROM cloud-computing-2022-345016.books.Books`
    const rows = await bigQuery.executeQuery(query)
    let books = [];
    rows.forEach(row => row.publishedDate = row.publishedDate.value);
    rows.forEach(row => books.push(row));
    return books;
}

// handlers:
const get = async (req, res, next) => {
    const reqBooks = await getBooksFromBigQuery();
    language = req.query.language
    return res.status(200).send(await translate.withTranslationAPI(reqBooks, language));
};

const getById = async (id, req, res, next) => {
    let book;
    language = req.query.language

    try {
        book = await getBookFromBigQuery(id);
    } catch (err) {
        if ((err.name = "BAD_RESPONSE_ERROR")) {
            return res.status(err.code).send({
                message: err.message,
            });
        }
        return res.status(500).send({});
    }
    return res.status(200).send(await translate.translateBook(book, language));
};

const extractBookFromReq = (req) => {
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
            name: "BAD_REQ",
            fields: _errors,
        };
    }

    return book;
};

/** TODO: use cloud storage */
const saveBookImg = async (req) => {
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

    imgUrl = cloudStorage.upload(req.file);

    return imgUrl;
};

const addBook = async (req, res, next) => {
    let book;
    try {
        book = extractBookFromReq(req);
    } catch (err) {
        if ((err.name = "BAD_REQ")) {
            return res.status(400).send({
                fields: err.fields,
                message: err.message,
            });
        }
        return res.status(500).send({});
    }

    console.log({ book });
    imgUrl = await saveBookImg(req);

    const maxId = await bigQuery.executeQuery("SELECT max(bookId) as id FROM cloud-computing-2022-345016.books.Books");
    const id = maxId[0].id + 1;
    const query = `INSERT INTO cloud-computing-2022-345016.books.Books VALUES (${id}, "${book.title}", "${book.author}", "${book.publishedDate}", "${book.description}", "${imgUrl}")`
    await bigQuery.executeQuery(query)
    return getById(id, req, res, next);
};

module.exports = {
    get,
    getById,
    addBook,
};
