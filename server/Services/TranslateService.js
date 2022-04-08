const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");

class TranslateService {
  static inject = ["Configuration"];
  constructor(config) {
    this.key = config.get("AZURE_TRANSLATE_CONFIG").key;
    this.region = config.get("AZURE_TRANSLATE_CONFIG").region;
    this.endpointText = config.get("AZURE_TRANSLATE_CONFIG").endpointText;

    this.withBookTranslation = this.withBookTranslation.bind(this);
    this.translateBooks = this.translateBooks.bind(this);
  }

  async withBookTranslation(bookOrBooks, language) {
    if (!language) {
      language = "en";
    }

    if (Array.isArray(bookOrBooks)) {
      return await this.translateBooks(bookOrBooks, language);
    }
    return (await this.translateBooks([bookOrBooks], language))[0];
  }

  async translateBooks(books, language) {
    /**
     * we don't want to call this.translate a number of {2*numOfBooks}, which would mean a LOT OF AXIOS REQUEST (very slow)
     * instead of that
     * we send a SINGLE axios request with payload like this [book1_title, book1_description, book2_title, book2_description, ... book_n_title, book_n_description]
     */
    const texts = [];
    for (let i = 0; i < books.length; i++) {
      texts.push(books[i].title);
      texts.push(books[i].description);
    }
    const translations = await this.translate(texts, language);

    //update update all books with all the translations
    for (let i = 0; i < translations.length; i += 2) {
      books[Math.floor(i/2)].title = translations[i];
      books[Math.floor(i/2)].description = translations[i + 1];
    }

    return books;
  }

  async translate(texts, lang) {
    if (lang === "en") {
        return texts;
    }

    return axios({
      baseURL: this.endpointText,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": this.key,
        "Ocp-Apim-Subscription-Region": this.region,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        from: "en",
        to: [lang],
      },
      data: texts.map(text => ({text})),
      responseType: "json",
    }).then(function (response) {
      return Promise.resolve(
        response.data.map(
          (item, index) => item.translations?.[0]?.text || texts[index]
        )
      );
    }).catch((err) => {
        console.log({err}, {errData: err.response.data})
        return Promise.resolve(
            texts
          );
    })
  }
}

module.exports = TranslateService;
