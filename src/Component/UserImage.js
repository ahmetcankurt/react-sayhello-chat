import { memo } from "react";
import { API_URL } from "../config";
import ProfileBg from "../assets/image/not-user-image-3.png";
import "./UserImage.css";

const UserImage = ({ src, alt }) => {

  return (
    <div className=" me-2">
        <img
          src={`${API_URL}/${src}`}
          className="chat-img-me loaded"
          alt={alt || "User image"}
          onError={(e) => {e.target.src = ProfileBg}}
          />
      {/* {isActive && <span className="status-light active" />} */}
    </div>
  );
}

export default memo(UserImage);