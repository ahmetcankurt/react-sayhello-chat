import { memo, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import axios from "axios";
import { io } from "socket.io-client";  
import { API_URL } from "../../config";

const socket = io(API_URL);

function ChatFooter({ selectedUser }) {
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menü aç/kapa durumu
  const userId = Number(localStorage.getItem("userId"));

  const handleMessageSend = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/messages`, {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
      });

      socket.emit('newMessage', {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
        createdAt: new Date().toISOString(),
        messageId: response.data.messageId 
      });

      setMessage('');
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleMessageSend();
    }
  };

  return (
    <div className="chat-footer-container">
      <div className="chat-footer">
        <BsThreeDots className="chat-icon" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        <input
          className="chat-search-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <BiSolidSend className="chat-icon" onClick={handleMessageSend} />
      </div>
      <div className={`chat-offcanvas ${isMenuOpen ? "open" : ""}`}>
        <div className="offcanvas-content">
          <p>⚙️ Ayarlar</p>
          <p>📜 Geçmiş Mesajlar</p>
          <p>🔔 Bildirimler</p>
        </div>
      </div>
    </div>
  );
}

export default memo(ChatFooter);
