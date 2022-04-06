const fs = require("fs");
const path = require("path");

class Configuration {
    #config
    
  constructor() {
    const appContext = fs.readFileSync(
      path.resolve(__dirname, "./../../appConfig.json")
    );
    this.#config = JSON.parse(appContext);

    this.get = this.get.bind(this);
  }

  get(key) {
    return this.#config[key];
  }
}

module.exports = Configuration;
