const { TextToSpeechClient } = require("@google-cloud/text-to-speech");

const fs = require("fs");
const path = require("path");
const cloudStorage = require("./cloudStorage");

// Creates a client
const client = new TextToSpeechClient({
  keyFilename: "cloud-computing-2022-345016-ede0eee78aaa.json",
});

function toBuffer(ab) {
  const buf = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

async function tts(text, userid) {
  const request = {
    input: { text },
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);
  const fileName = `${userid}.mp3`;
  const url = await cloudStorage.uploadFile(
    {
      buffer: toBuffer(response.audioContent.buffer),
    },
    fileName
  );
  console.log("Audio content written to file: " + url);

  return url;
}

const languageDict = {
  "en" : "en-US",
  'ro' : 'ro-RO',
  'de' : 'de-DE',
  'zh' : 'yue-HK'  
}

const postPlayAudio = async (req, res, next) => {
  const userId = String(req.body["userId"]).replace(/[@.]/, "");
  const text = String(req.body["text"]);
  const language = languageDict[String(req.body["language"])] || languageDict.en;

  try {
    const fileName = await tts(text, userId, language);
    return res.status(200).send({ fileName });
  } catch (err) {
    console.log("Exception tts: ", err);
    return res.status(500).send(err);
  }
};

module.exports = {
  postPlayAudio,
};
