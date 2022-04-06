class AudioController {
    static inject = ["TextToSpeechService"];

    constructor(textToSpeechService) {
        this.textToSpeechService = textToSpeechService;
        this.create = this.create.bind(this);
    }

    async create(req, res) {
        const userId = String(req.body["userId"]).replace(/[@.]/, "");
        const text = String(req.body["text"]);
        const language = this.textToSpeechService.getLanguage(String(req.body["language"]));
        console.log({language})

        try {
            const fileName = await this.textToSpeechService.createAudio(text, userId, language);
            return res.status(200).send({ fileName });
        } catch (err) {
            console.log("Exception tts: ", err);
            return res.status(500).send(err);
        }
    };
}

module.exports = AudioController;