import React, { memo } from "react";
import "./ScrollContainer.css"; // CSS dosyamızı import ediyoruz.

const ScrollContainer = ({ children, className = "", style = {}, maxHeight }) => {
  return (
    <div
      className={`scroll-container ${className}`}
      style={{ ...style, maxHeight: maxHeight ? maxHeight : style.maxHeight }}
    >
      {children}
    </div>
  );
};

export default memo(ScrollContainer);