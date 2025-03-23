import { memo, useState } from "react";
import "./UserImage.css";
import { API_URL } from "../config";
import NotUserImage from "./NotUserImage";
import ProfileBg from "../assets/image/image_header.jpg";

const UserImage = ({ src, alt }) => {

  const handleError = (e) => {
    e.target.src = ProfileBg; // Default image when error occurs
  };

  return (
    <div className=" me-2">
        <img
          src={`${API_URL}/${src}`}
          className="chat-img-me loaded"
          alt={alt || "User image"}
          onError={handleError}
          />
      {/* {isActive && <span className="status-light active" />} */}
    </div>
  );
}

export default memo(UserImage);
