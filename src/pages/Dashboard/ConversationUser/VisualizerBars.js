import React, { useEffect, useRef } from "react";

const AudioVisualizer = ({ audioRef }) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    const src = ctx.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(ctx.destination);
    analyser.fftSize = 32;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const bars = Array.from({ length: 16 }, (_, i) => {
      const bar = document.createElement("div");
      bar.className = "visual-bar";
      containerRef.current.appendChild(bar);
      return bar;
    });

    const render = () => {
      analyser.getByteFrequencyData(dataArray);

      bars.forEach((bar, i) => {
        const height = dataArray[i] / 2;
        bar.style.height = `${height}px`;
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      ctx.close();
    };
  }, [audioRef]);

  return <div className="visualizer-container" ref={containerRef}></div>;
};

export default AudioVisualizer;
