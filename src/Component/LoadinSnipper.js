import React, { memo } from "react";
import "./LoadinContainer.css";

function LoadinContainer() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );
}

export default memo(LoadinContainer);
