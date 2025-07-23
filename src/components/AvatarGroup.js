import React from "react";
import "./AvatarGroup.css";

const avatars = [
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/64.jpg",
];

const AvatarGroup = () => {
  return (
    <div className="avatar-group">
      {avatars.map((src, index) => (
        <img key={index} src={src} className="avatar" />
      ))}
    </div>
  );
};

export default AvatarGroup;
