import React, { memo, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import "./Mymessages.css";

function Messages({ message, setSelectedUser }) {
  // Mesajın 30 karakterden fazla olup olmadığını kontrol ediyoruz ve fazlasını "..." ile kısıyoruz
  const shortenedMessage = message.lastMessage?.length > 30 ? message?.lastMessage.slice(0, 30) + "..." : message.lastMessage;

  return (
    <div className="messages-blog" onClick={() => setSelectedUser(message.userId)} >
      <div className="chat-img-container me-2">
        {/* User objesinin image özelliği varsa göster, yoksa varsayılan bir resim göster */}
        <img 
        src={`http://localhost:3000/${message?.profileImage}`}
        className="chat-img-me" alt="Profile" />
        <span className={`status-light ${message.isActive ? "active" : "inactive"}`} />   
      </div>
      <div>
        <span>{message.name} {message.surname}</span>
        <p className="messages-detail">{shortenedMessage}</p>
      </div>
    </div>
  );
}

function Index({ selectedUser, setSelectedUser }) {
  const [messages, setMessages] = useState([]); // Mesajlar state'i
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/messages/users/${userId}`);
          setMessages(response.data.contacts);
        } catch (error) {
          console.error("Mesajları alma hatası:", error);
        }
      };
      fetchMessages();
    }
  }, [selectedUser]); // selectedUser değiştiğinde tekrar API'yi çağıracak 

  return (
    <div className="Mymessages-container">
      <div className="Mymessages-add">
        <span className="Mymessages-title">Chats</span>
        <MdAdd className="Mymessages-icon" />
      </div>
      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-input" />
        <FaSearch className="search-icon" />
      </div>
      {/* Mesajları döngü ile render ediyoruz */}
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
