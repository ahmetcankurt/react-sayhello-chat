import React, { useEffect, useState, useRef } from "react";
import { Button, UncontrolledPopover, PopoverBody } from "reactstrap";
import { useAudioRecorder } from "./useAudioRecorder";

const EndButtons = ({ onSubmit, isSending, onAudioRecorded }) => {
  const {
    recording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);

  // Kayıt başladığında süreyi artır
  useEffect(() => {
    if (recording) {
      setDuration(0); // kayıt başlarken sıfırla
      intervalRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [recording]);

  // Audio hazır olduğunda parent'a dosya gönder
  useEffect(() => {
    if (audioBlob) {
      const audioFile = new File([audioBlob], `${Date.now()}.webm`, { type: "audio/webm" });
      onAudioRecorded(audioFile);
    }
  }, [audioBlob]);

  // Zaman formatlama (ör: 00:15)
  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="chat-input-links ms-2 gap-md-1">
      <div className="links-list-item d-none d-sm-block">
        <Button
          color="none"
          type="button"
          className="btn btn-link text-decoration-none btn-lg waves-effect"
          id="audio-btn"
          
        >
          <i onClick={() => (recording ? stopRecording() : (resetRecording(), startRecording()))} className={`bx ${recording ? "bxs-microphone-off" : "bx-microphone"} align-middle`}></i>
        </Button>
      </div>

      <UncontrolledPopover trigger="focus" placement="top" target="audio-btn">
        <PopoverBody>
          {recording ? `🎙️ Kayıt yapılıyor... ${formatDuration(duration)}` : "🎧 Kayıt başlatmak için tıkla"}
        </PopoverBody>
      </UncontrolledPopover>

      <div className="links-list-item">
        <Button
          color="primary"
          type="submit"
          disabled={isSending}
          className="btn btn-primary btn-lg chat-send waves-effect waves-light"
          onClick={onSubmit}
        >
          <i className="bx bxs-send align-middle"></i>
        </Button>
      </div>
    </div>
  );
};

export default EndButtons;
