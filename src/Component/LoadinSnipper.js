import React, { memo } from "react";
import "./LoadinContainer.css";

function LoadinContainer() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      {/* <p>Yükleniyor...</p> */}
      <p className="wave-text">
        {"Loading...".split("").map((char, index) => (
          <span
            key={index}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </p>
    </div>
  );
}

export default memo(LoadinContainer);
