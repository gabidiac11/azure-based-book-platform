const sdk = require("microsoft-cognitiveservices-speech-sdk");

class SpeechToTextService {
  static inject = ["Configuration"];
  #key;
  #region;

  constructor(config) {
    this.#key = config.get("AZURE_SPEECH_CONFIG").key;
    this.#region = config.get("AZURE_SPEECH_CONFIG").region;

    this.getText = this.getText.bind(this);
  }

  async getText(file) {
    console.log({ file });
    let audioConfig = sdk.AudioConfig.fromWavFileInput(file.buffer);
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      this.#key,
      this.#region
    );
    let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    return await new Promise((resolve, reject) => {
      speechRecognizer.recognizeOnceAsync((result) => {
        console.log("speech results", result);
        switch (result.reason) {
          case sdk.ResultReason.RecognizedSpeech:
            resolve({ recognised: true, text: result.text });
            break;

          case sdk.ResultReason.NoMatch:
            resolve({ recognised: false, reason: "NOMATCH" });
            break;

          case sdk.ResultReason.Canceled:
            const cancellation = sdk.CancellationDetails.fromResult(result);
            let err = `CANCELED: Reason=${cancellation.reason}`;
            if (cancellation.reason == sdk.CancellationReason.Error) {
              err += `\nCANCELED: ErrorCode=${cancellation.ErrorCode}\nCANCELED: ErrorDetails=${cancellation.errorDetails}\n`;
            } else {
              err += "Unknown error.";
            }
            reject(err);
        }
        speechRecognizer.close();
      });
    });
  }
}

module.exports = SpeechToTextService;
