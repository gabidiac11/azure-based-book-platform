const SpeechToTextService = require("../Services/SpeechToTextService");

class AudioController {
  static inject = ["TextToSpeechService", "SpeechToTextService"];

  constructor(textToSpeechService, speechToTextService) {
    this.textToSpeechService = textToSpeechService;
    /**
     * @type {SpeechToTextService}
     */
    this.speechToTextService = speechToTextService;

    this.create = this.create.bind(this);
    this.audioToText = this.audioToText.bind(this);
  }

  async create(req, res) {
    const userId = String(req.body["userId"]).replace(/[@.]/, "");
    const text = String(req.body["text"]);
    const language = this.textToSpeechService.getLanguage(
      String(req.body["language"])
    );

    try {
      const fileName = await this.textToSpeechService.createAudio(
        text,
        userId,
        language
      );
      return res.status(200).send({ fileName });
    } catch (err) {
      console.log("Exception tts: ", err);
      return res.status(500).send(err);
    }
  }

  async audioToText(req, res) {
    try {
      const result = await this.speechToTextService.getText(req.file);
      return res.status(200).send(result);
    } catch (err) {
      console.log("Exception stt: ", err);
      return res.status(500).send({ message: err?.message });
    }
  }
}

module.exports = AudioController;
