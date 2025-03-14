import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import UserImage from "../../Component/UserImage";
import { TbCircleArrowLeft } from "react-icons/tb";
import { API_URL } from "../../config";
function ChatHeader({ selectedUser, handleProfileClick ,clearSelectedUser }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      // Backend'e token ile istek gönderiyoruz
      axios
        .get(`${API_URL}/users/my-friends-profile/${selectedUser}`)
        .then((response) => {
          setUserInfo(response.data); // Gelen kullanıcı bilgilerini state'e kaydet
        })
        .catch((error) => {
          console.error("Kullanıcı bilgileri alınırken hata:", error);
        });
    }
  }, [selectedUser]);
  if (!selectedUser) {
    return
  }


  return (
    <div className="chat-header">
      <TbCircleArrowLeft className="header-close-icon" onClick={clearSelectedUser} />
      <UserImage src={userInfo?.profileImage} isActive={userInfo?.isActive} />
      <div className="chat-info">
        <span className="chat-name" onClick={handleProfileClick}>{userInfo?.name} {userInfo?.surname}</span>
        <span className={`chat-status ${userInfo?.isActive ? "Online" : "Offline"}`}>
          {userInfo?.status}
        </span>
      </div>
    </div>
  );
}

export default memo(ChatHeader);