import { memo, useState } from "react";
import "./UserImage.css";
import { API_URL } from "../config";
import NotUserImage from "./NotUserImage";

const UserImage = ({ src, isActive, alt, height, width }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="chat-img-container me-2">
      {src && !imageError ? (
        <img
          src={`${API_URL}/${src}`}
          className="chat-img-me loaded"
          alt={alt || "User image"} 
          onError={() => setImageError(true)}
          style={{ height: `${height}px`, width: `${width}px` }}  
        />
      ) : (
        <NotUserImage height={height} width={width} />
      )}
      {/* {isActive && <span className="status-light active" />} */}
    </div>
  );
}

export default memo(UserImage);
