const { TextToSpeechClient } = require("@google-cloud/text-to-speech");

class TextToSpeechService {
    languageDict = {
        en: "en-US",
        ro: "ro-RO",
        de: "de-DE",
        zh: "yue-HK"
    }

    static inject = ["Configuration", "StorageService"];
    constructor(config, storageService) {
        this.client = new TextToSpeechClient({
            keyFilename: config.get("GC_KEY_FILENAME"),
        });
        this.storageService = storageService;

        this.toBuffer = this.toBuffer.bind(this);
        this.createAudio = this.createAudio.bind(this);
        this.getLanguage = this.getLanguage.bind(this);
    }

    toBuffer(ab) {
        const buf = Buffer.alloc(ab.byteLength);
        const view = new Uint8Array(ab);
        for (let i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
        }
        return buf;
    }

    async createAudio(text, userid, languageCode) {
        const request = {
            input: { text },
            voice: { languageCode, ssmlGender: "NEUTRAL" },
            audioConfig: { audioEncoding: "MP3" },
        };

        const [response] = await this.client.synthesizeSpeech(request);
        const fileName = `${userid}.mp3`;
        const url = await this.storageService.uploadFile(
            {
                buffer: this.toBuffer(response.audioContent.buffer),
            },
            fileName
        );
        console.log("Audio content written to file: " + url);

        return url;
    }

    getLanguage(lan) {
        return this.languageDict[lan] || this.languageDict.en;
    }
}

module.exports = TextToSpeechService;