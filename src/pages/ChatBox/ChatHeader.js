import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import UserImage from "../../Component/UserImage";
import { TbCircleArrowLeft } from "react-icons/tb";
import { API_URL } from "../../config";
import { capitalize } from "../../utils/stringUtils";

function ChatHeader({ selectedUser, handleProfileClick, clearSelectedUser }) {
  const [userInfo, setUserInfo] = useState(null);

  const Name = capitalize(userInfo?.name);
  const Surname = capitalize(userInfo?.surname);

  useEffect(() => {
    if (selectedUser) {
      // Backend'e token ile istek gönderiyoruz
      axios
        .get(`${API_URL}/users/my-friends-profile/${selectedUser}`)
        .then((response) => {
          setUserInfo(response.data); // Gelen kullanıcı bilgilerini state'e kaydet
        })
        .catch((error) => {
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
      <span className="chat-name" onClick={handleProfileClick}>{Name} {Surname}</span>
    </div>
  );
}

export default memo(ChatHeader);