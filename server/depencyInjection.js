const { Injector } = require("boxed-injector");

const injector = new Injector();
injector.factory("Configuration", require("./Services/Configuration"));

injector.factory("Database", require("./Database/Database"));
injector.factory("BookRepository", require("./Repositories/BookRepository"));

injector.factory("BookController", require("./Controllers/BookController"));
injector.factory("AudioController", require("./Controllers/AudioController"));

injector.factory("BookService", require("./Services/BookService"));
injector.factory("StorageService", require("./Services/StorageService"));
injector.factory("TextToSpeechService", require("./Services/TextToSpeechService"));
injector.factory("TranslateService", require("./Services/TranslateService"));

module.exports = injector;