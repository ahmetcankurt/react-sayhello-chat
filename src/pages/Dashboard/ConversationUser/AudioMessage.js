import React, { useRef, useState, useEffect } from "react";
import "./AudioMessage.css"; // Import your CSS styles

const formatTime = (sec) => {
  if (isNaN(sec) || !isFinite(sec)) return "00:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

const CustomAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const onSeek = (e) => {
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="player-container">
      <button
        onClick={togglePlay}
        className="play-pause-btn"
        aria-label={isPlaying ? "Durdur" : "Oynat"}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="progress-container">
        <input
          type="range"
          min="0"
          max={duration}
          value={progress}
          onChange={onSeek}
          step="0.1"
          aria-label="Ses ilerleme çubuğu"
          className="progress-bar"
          style={{
            '--progress': `${progressPercent}%`
          }}
        />


        <div className="time-text">
          {formatTime(progress)} - {formatTime(duration)}
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};

export default CustomAudioPlayer;
