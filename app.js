const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const app = express();
const models = require("./server/models");
const multer = require("multer");
const upload = multer();
const fs = require("fs");

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

app.get("/api/books/:id", (req, res, next) =>
  models.bookModule.getById(Number(req.params.id), req, res, next)
);
app.get("/api/books", models.bookModule.get);
app.post("/api/books", upload.single("imgFile"), models.bookModule.addBook);
app.post("/api/play", models.playModule.postPlayAudio);
app.get("/api/audio/:fileName", function (req, res) {
  const pathName = path.join(__dirname, "server/audio", req.params.fileName);
  if (!fs.existsSync(pathName)) {
    return res.status(404).send();
  }
  res.sendFile(pathName);
});
app.get("/api", models.testModule.index);

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

