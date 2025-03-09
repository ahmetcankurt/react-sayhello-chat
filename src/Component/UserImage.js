import { memo, useState } from "react";
import NotUserImage from "./NotUserImage";

const UserImage = ({ src, isActive }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="chat-img-container me-2">
      {src ? (
        <>
          {!imageLoaded && <NotUserImage />}
          <img
            src={`http://localhost:3000/${src}`}
            className={`chat-img-me ${imageLoaded ? "loaded" : ""}`}
            alt="Profile"
            onLoad={handleImageLoad}
          />
        </>
      ) : (
        <NotUserImage />
      )}
      <span className={`status-light ${isActive ? "active" : "inactive"}`} />
    </div>
  );
};

export default memo(UserImage);