import React, { memo, useEffect, useState, useCallback } from "react";
import axios from "axios";
import SearchInput from "../../Component/input/searchInput";
import UserImage from "../../Component/UserImage";
import "./Mymessages.css";
import { MdAdd } from "react-icons/md";

// Kısa mesaj fonksiyonu
const getShortenedMessage = (message, maxLength = 20) => {
  return message?.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
};

// Message bileşeni
function Messages({ message, setSelectedUser, selectedUser }) {
  const { lastMessage, name, surname, userId, profileImage, isActive, lastMessageSender } = message;
  const shortenedMessage = getShortenedMessage(lastMessage);

  const isActiveUser = userId === selectedUser;

  return (
    <div className={`messages-blog ${isActiveUser ? "active" : ""}`} onClick={() => setSelectedUser(userId)}>
      <div>
        <UserImage src={profileImage} isActive={isActive} />
      </div>
      <div>
        <span>{name} {surname}</span>
        <p className="messages-detail m-0">{lastMessageSender} : {shortenedMessage}</p>
      </div>
    </div>
  );
}

// Index bileşeni
function Index({ selectedUser, setSelectedUser }) {
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("userId");

  const fetchMessages = useCallback(async () => {
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:3000/messages/users/${userId}`);
        setMessages(response.data.contacts);
      } catch (error) {
        console.error("Mesajları alma hatası:", error);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, selectedUser]); // `fetchMessages` fonksiyonunu bağımlılık olarak ekledik

  return (
    <div>
      <div className="Mymessages-add">
        <span className="Mymessages-title">Mesajlarım</span>
        <MdAdd className="Mymessages-icon" />
      </div>
      <SearchInput />
      {messages.map((message, index) => (
        <Messages
          key={index}
          message={message}
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}  // Prop olarak aktarıyoruz.
        />
      ))}
    </div>
  );
}

export default memo(Index);