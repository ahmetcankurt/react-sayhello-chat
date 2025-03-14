import { memo } from "react";
import "./UserImage.css";
import { API_URL } from "../config";

const UserImage = ({ src, isActive }) => {
  return (
    <div className="chat-img-container me-2">
      <div className="image-wrapper">
        {src ? (
          <img
            src={`${API_URL}/${src}`}
            className={`chat-img-me ${src ? "loaded" : ""}`}
            alt="Profile"
            onLoad={(e) => {
              e.target.classList.add("loaded");
            }}
          />
        ) : (
          <div className="image-placeholder" />
        )}
        <span className={`status-light ${isActive ? "active" : "inactive"}`} />
      </div>
    </div>
  );
};

export default memo(UserImage);