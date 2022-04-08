import React, { useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Mic, MicOff } from "@mui/icons-material";
import MicRecorder from "mic-recorder-to-mp3";
import "./RecorderButton.css";
import { CircularProgress } from "@mui/material";

const mp3Recorder = new MicRecorder({ bitRate: 128 });

const isRecordingBlocked = () =>
  new Promise((resolve) => {
    navigator.getUserMedia(
      { audio: true },
      () => {
        resolve(false);
      },
      () => {
        resolve(true);
      }
    );
  });

export default function Recorder(props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timeout = useRef(0);
  const [blobURL, setBlobURL] = useState("");

  const onClickMic = async () => {
    if (await isRecordingBlocked()) {
      window.alert(
        "Audio is blocked in browser site settings. You must enable recording for this to work."
      );
      setIsRecording(false);
      return;
    }

    if (isRecording) {
      stop();
    } else {
      start();
    }
  };

  const start = () => {
    clearTimeout(timeout.current);
    mp3Recorder
      .start()
      .then(() => {
        setIsRecording(true);
        timeout.current = setTimeout(() => {
          stop();
        }, 12_000);
      })
      .catch((e) => alert(e));
  };

  const stop = () => {
    clearTimeout(timeout.current);
    mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        setBlobURL(URL.createObjectURL(blob));
        setIsRecording(false);
        submitAudio([buffer, blob]);
      })
      .catch((e) => console.log(e));
  };

  const submitAudio = async (results) => {
    setIsLoading(true);
    try {
      await props.sendAudio(results);
    } catch (err) {}
    setIsLoading(false);
  };

  return (
    <div className="recorder-section">
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        className={`record-btn ${isRecording ? "is-recording" : ""} ${
          isLoading ? "loading" : ""
        }`}
        disabled={isLoading}
        onClick={onClickMic}
      >
        {(() => {
          if (isLoading) {
            return (
              <CircularProgress
                color="secondary"
                className="loading-btn"
              />
            );
          }
          return isRecording ? <Mic htmlColor="red" /> : <MicOff />;
        })()}
      </IconButton>
      <audio src={blobURL} controls="controls" />
    </div>
  );
}
