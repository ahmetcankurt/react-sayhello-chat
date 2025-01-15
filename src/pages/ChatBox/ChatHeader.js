import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import "./ChatHeaderFooter.css";

function ChatHeader({ selectedUser, handleProfileClick }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      // Backend'e token ile istek gönderiyoruz
      axios
        .get(`http://localhost:3000/users/my-friends-profile/${selectedUser}`)
        .then((response) => {
          setUserInfo(response.data); // Gelen kullanıcı bilgilerini state'e kaydet
        })
        .catch((error) => {
          console.error("Kullanıcı bilgileri alınırken hata:", error);
        });
    }
  }, [selectedUser]);

  if (!selectedUser) {
    return <div>Kullanıcı seçilmedi.</div>;
  }

  if (!userInfo) {
    return <div>Yükleniyor...</div>; // userInfo yüklenene kadar bir yükleme durumu göster
  }

  return (
    <div className="chat-header">
      <div className="chat-img-container me-2">
        <img src={`http://localhost:3000/${userInfo?.profileImage}`} className="chat-img-me" alt="Profile" />
        <span
          className={`status-light ${userInfo.isActive ? "active" : "inactive"}`}
        />
      </div>
      <div className="chat-info">
        <span className="chat-name" onClick={handleProfileClick}>{userInfo.name} {userInfo.surname}</span>
        <span className={`chat-status ${userInfo.isActive ? "Online" : "Offline"}`}>
          {userInfo.isActive ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
}

export default memo(ChatHeader);
