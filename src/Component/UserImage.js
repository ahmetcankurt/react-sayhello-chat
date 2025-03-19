import { memo, useState } from "react";
import "./UserImage.css";
import { API_URL } from "../config";
import NotUserImage from "./NotUserImage";
import "./UserImage.css"

const UserImage = ({ src, isActive, alt }) => {

  const [imageError, setImageError] = useState(false);

  return (
    <div className="chat-img-container me-2">
        {src && !imageError ? (
          <img
            src={`${API_URL}/${src}`}
            className="chat-img-me loaded"
            alt={alt}
            onError={() => setImageError(true)}
          />
        ) : (
          <NotUserImage />
        )}
        {/* {isActive && <span className="status-light active" />} */}
    </div>
  );
}

export default memo(UserImage);
