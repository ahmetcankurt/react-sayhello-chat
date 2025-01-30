import React, { memo, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MdAdd } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import SearchInput from "../../Component/input/searchInput";
import "./Mymessages.css";

// Kısa mesaj fonksiyonu
const getShortenedMessage = (message, maxLength = 30) => {
  return message?.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
};

// Kullanıcı resmini render etme fonksiyonu
const UserImage = ({ src, isActive }) => (
  <div className="chat-img-container me-2">
    <img
      src={`http://localhost:3000/${src}`}
      className="chat-img-me"
      alt="Profile"
    />
    <span className={`status-light ${isActive ? "active" : "inactive"}`} />
  </div>
);

// Message bileşeni
function Messages({ message, setSelectedUser }) {
  const { lastMessage, name, surname, userId, profileImage, isActive ,lastMessageSender} = message;
  const shortenedMessage = getShortenedMessage(lastMessage);

  return (
    <div className="messages-blog" onClick={() => setSelectedUser(userId)}>
      <UserImage src={profileImage} isActive={isActive} />
      <div>
        <span>{name} {surname}</span>
        <p className="messages-detail">{lastMessageSender} : {shortenedMessage}</p>
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
        {/* <MdAdd className="Mymessages-icon" /> */}
      </div>
      <SearchInput />
      <div className="messages-list">
        {messages.map((message, index) => (
          <Messages
            key={index}
            message={message}
            setSelectedUser={setSelectedUser}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(Index);
