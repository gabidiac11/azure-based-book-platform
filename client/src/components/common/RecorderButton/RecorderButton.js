import React, { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Mic, MicOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import AudioReactRecorder, { RecordState } from "./recorder-js/dist";
import "./RecorderButton.css";

const initAudioAndGetSupport = () => {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia =
      navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    return true;
  } catch (e) {
    return false;
  }
};

export default function RecorderButton(props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timeout = useRef(0);
  const [blobURL, setBlobURL] = useState("");
  const [recordState, setRecordState] = useState();
  const hasSupport = useRef(initAudioAndGetSupport());

  const onClickMic = async () => {
    if (!hasSupport.current) {
      return alert("No web audio support in this browser!");
    }

    if (isRecording) {
      return stop();
    }
    start();
  };

  const start = () => {
    clearTimeout(timeout.current);
    setIsRecording(true);
    setRecordState(RecordState.START);
    timeout.current = setTimeout(stop, 12_000);
  };

  const stop = () => {
    clearTimeout(timeout.current);
    setRecordState(RecordState.STOP);
    setIsRecording(false);
  };

  const submitAudio = async (data) => {
    setIsLoading(true);
    setBlobURL(data.url);
    try {
      await props.sendAudio(data.blob);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recorder-section">
      <AudioReactRecorder.default state={recordState} onStop={submitAudio} />
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
              <CircularProgress color="secondary" className="loading-btn" />
            );
          }
          return isRecording ? <Mic htmlColor="red" /> : <MicOff />;
        })()}
      </IconButton>
      <audio src={blobURL} controls="controls" />
    </div>
  );
}
