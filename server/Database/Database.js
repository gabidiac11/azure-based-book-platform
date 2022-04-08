const path = require("path");
const fs = require("fs");
const mysql = require("mysql");

class Database {
  static inject = ["Configuration"];
  constructor(config) {
    this.selectQuery = this.selectQuery.bind(this);
    this.insertQuery = this.insertQuery.bind(this);

    this.conn = mysql.createConnection(this.#getDbConfig(config));
    this.conn.connect((err) => {
      if (err) {
        console.log("Cannot connect to database");
        throw err;
      }
      console.log("Connected to database...");
    });
  }

  #getDbConfig(config) {
    const dbConfig = config.get("AZURE_DB_CONFIG");
    const certificatePath = path.resolve(__dirname, `./${dbConfig.ssl.ca}`);
    dbConfig.ssl.ca = fs.readFileSync(certificatePath);
    return dbConfig;
  }

  async selectQuery(query) {
    return new Promise((resolve) => {
      this.conn.query(query, (err, results, fields) => {
        if (err) throw err;
        return resolve(results);
      });
    });
  }

  async query(query) {
    return new Promise((resolve) => {
      this.conn.query(query, (err, results, fields) => {
        if (err) throw err;
        return resolve(results);
      });
    });
  }

  async insertQuery(query, values) {
    return new Promise((resolve) => {
      this.conn.query(query, values, (err, results) => {
        if (err) throw err;
        return resolve(results);
      });
    });
  }
}

module.exports = Database;
