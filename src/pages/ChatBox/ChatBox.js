import React, { memo, useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash, FaReply } from 'react-icons/fa';
import axios from 'axios'; // API çağrısı için axios
import "./ChatBox.css";
import { io } from "socket.io-client";  // Socket.IO istemcisi
const socket = io("http://localhost:3000"); // Socket.IO sunucusuna bağlanıyoruz
function ChatBox({ selectedUser }) {
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [messages, setMessages] = useState([]); // Mesajlar state'i
  const chatBoxRef = useRef(null);
  const userId = localStorage.getItem("userId");

  // API'den mesajları alma
  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/messages/${userId}/${selectedUser}`);
          setMessages(response.data.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        } catch (error) {
          console.error("Mesajları alma hatası:", error);
        }
      };
      fetchMessages();
    }
  }, [selectedUser]); // selectedUser değiştiğinde tekrar API'yi çağıracak


  useEffect(() => {
    socket.on('newMessage', (message) => {
      // Gelen mesajın, seçili kullanıcıyla ilişkili olup olmadığını kontrol edin
      if (
        (message.senderId == userId && message.receiverId == selectedUser) ||
        (message.senderId == selectedUser && message.receiverId == userId)
      ) {
        setMessages(prevMessages => [...prevMessages, message]); // Mesajları sadece seçili kullanıcıya göre ekliyoruz
      }
    });

    return () => {
      socket.off('newMessage'); // Temizleme
    };
  }, [userId, selectedUser]); // `userId` ve `selectedUser` bağımlılık olarak eklenmeli


  // Mesajları kaydırma işlemi
  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight; // En son mesajı en alta kaydırmak için
    }
  }, [messages]); // Mesajlar değiştiğinde scroll'u en alta kaydır

  const toggleDropdown = (index) => {
    if (dropdownVisible === index) {
      setDropdownVisible(null);
    } else {
      setDropdownVisible(index);
    }
  };

  if (!selectedUser) {
    return <div>Kullanıcı seçilmedi.</div>;
  }

  if (!messages) {
    return <div>Yükleniyor...</div>; // userInfo yüklenene kadar bir yükleme durumu göster
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="chat-box" ref={chatBoxRef}>
      {messages.slice().reverse().map((message, index) => (
        <div key={index} className={`message ${message.senderId == userId ? 'senderId' : 'receiverId'}`}>

          {message.senderId == userId && (
            <>
              {dropdownVisible == index && (
                <div className="dropdown-chat">
                  <FaTrash className="dropdown-chat-icon" />
                  <FaReply className="dropdown-chat-icon" />
                </div>
              )}
              <BsThreeDotsVertical
                className="chat-dots-icon"
                onClick={() => toggleDropdown(index)}
              />

            </>
          )}
          <div className={`message-content ${message.senderId == userId ? 'senderId' : 'receiverId'}`}>
            <p>{message.content}</p>
            <span className="message-clock">{formatTime(message.createdAt)}</span>
          </div>
          {message.receiverId == userId && (
            <>

              <BsThreeDotsVertical
                className="chat-dots-icon"
                onClick={() => toggleDropdown(index)}
              />
              {dropdownVisible == index && (
                <div className="dropdown-chat">
                  <FaTrash className="dropdown-chat-icon" />
                  <FaReply className="dropdown-chat-icon" />
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default memo(ChatBox)
