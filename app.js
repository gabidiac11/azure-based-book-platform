const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer();
const fs = require("fs");

const injector = require("./server/depencyInjection");
const bookController = injector.get("BookController");
const audioController = injector.get("AudioController");

app.use(express.static(path.join(__dirname, "../build")));

app.use(bodyParser.json());
app.use(express.urlencoded());

app.use(express.static("client/build"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/books/:id", bookController.getBook);
app.get("/api/books", bookController.getAllBooks);
app.post("/api/books", upload.single("imgFile"), bookController.createBook);

app.post("/api/play", audioController.create);

app.get("/*", function (req, res) {
  const pathName = path.join(__dirname, "client/build", "index.html");
  if (!fs.existsSync(pathName)) {
    return res.status(404).send();
  }

  res.sendFile(pathName);
});

const port = process.env.SERVER_STAGE === "local" ? 5001 : 8080;
app.listen(port, () => console.log(`Listening on port ${port}!`));

module.exports = app;