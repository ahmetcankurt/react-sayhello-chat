import { memo, useEffect, useState } from "react";
import { API_URL } from "../config";
import ProfileBg from "../assets/image/not-user-image-3.png";
import "./UserImage.css";

const UserImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        setLoaded(true);
      }, 2000);
    }
  }, [loaded]);

  return (
    <div className="me-2">
      <img
        src={`${API_URL}/${src}`}
        className={`chat-img-me ${loaded ? "loaded" : "loading"}`}
        alt={alt || "User image"}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.target.src = ProfileBg;
        }}
      />
    </div>
  );
};

export default memo(UserImage);
