import { memo, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import axios from "axios";
import { io } from "socket.io-client";  // Socket.IO istemcisi
import { API_URL } from "../../config";
const socket = io(API_URL);

function ChatFooter({ selectedUser }) {
  const [message, setMessage] = useState('');
  const userId = Number(localStorage.getItem("userId"));

  const handleMessageSend = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/messages`, {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
      });
      // Mesajı Socket.IO ile anında göndermek
      socket.emit('newMessage', {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
        createdAt: new Date().toISOString(),
        messageId: response.data.messageId // Yeni eklenen mesajın ID'si
      });

      setMessage('');
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    }
  };

  // Enter tuşuna basıldığında mesaj gönderme
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Sayfanın yenilenmesini engelle
      handleMessageSend();
    }
  };

  return (
    <div className="chat-footer">
      <BsThreeDots className="chat-icon" />
      <input
        className="chat-search-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown} // Enter tuşuna basıldığında tetiklenecek
      />
      <BiSolidSend className="chat-icon" onClick={handleMessageSend} />
    </div>
  );
}

export default memo(ChatFooter);