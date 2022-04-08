const sdk = require("microsoft-cognitiveservices-speech-sdk");

class TextToSpeechService {
  languageDict = {
    en: "en-US",
    ro: "ro-RO",
    de: "de-DE",
    zh: "yue-HK",
    ru: "ru-RU",
  };

  static inject = ["Configuration", "StorageService"];
  constructor(config, storageService) {
    this.key = config.get("AZURE_SPEECH_CONFIG").key;
    this.region = config.get("AZURE_SPEECH_CONFIG").region;

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

  getVoice(lang) {
    const voices = {
      "en-US": "en-US-GuyNeural",
      "ro-RO": "ro-RO-AlinaNeural",
      "de-DE": "de-DE-ConradNeural",
      "yue-HK": "zh-CN-XiaoxiaoNeural",
      "ru-RU": "ru-RU-SvetlanaNeural",
    };

    return voices[lang] || voices["en-US"];
  }

  async createAudio(text, userid, languageCode) {
    const fileName = `${userid}.mp3`;

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      this.key,
      this.region
    );
    speechConfig.speechSynthesisVoiceName = this.getVoice(languageCode);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    //convert to promise and return buffer
    const arrayBuffer = await new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        (result) => {
          console.log({ result });
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            resolve(result.audioData);
          } else {
            reject(
              "Speech synthesis canceled, " +
                result.errorDetails +
                "\nDid you set the speech resource key and region values?"
            );
          }
          synthesizer.close();
          synthesizer = null;
        },
        (err) => {
          synthesizer.close();
          synthesizer = null;
          console.log({ err });
          reject(err);
        }
      );
    });

    console.log({ arrayBuffer });

    //upload to storage
    const url = await this.storageService.uploadFile(
      {
        buffer: this.toBuffer(arrayBuffer),
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
