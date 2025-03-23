import { memo, useState, useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import axios from "axios";
import { io } from "socket.io-client";
import { API_URL } from "../../config";

function ChatFooter({ selectedUser }) {
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menü aç/kapa durumu
  const socketRef = useRef(null);
  const userId = Number(localStorage.getItem("userId"));

  // Socket bağlantısını bileşen mount edildiğinde oluşturun
  useEffect(() => {
    socketRef.current = io(API_URL);
    
    // Bileşen unmount olduğunda socket bağlantısını kapatın
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleMessageSend = async () => {
    if (!message.trim()) return;

    try {
      // Mesajı sunucuya kaydet
      const response = await axios.post(`${API_URL}/messages`, {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
      });

      // Socket üzerinden yeni mesaj bildirimi gönder
      socketRef.current.emit('newMessage', {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
        createdAt: new Date().toISOString(),
        messageId: response.data.messageId
      });

      setMessage('');
    } catch (error) {
      console.error("Message send error", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleMessageSend();
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Boyutun dinamik olarak değişmesini sağlamak için fonksiyon
  const handleResize = (e) => {
    e.target.style.height = "auto";
    const newHeight = e.target.scrollHeight;
    if (newHeight > 130) {
      e.target.style.height = "130px";
      e.target.style.overflowY = "scroll";
    } else {
      e.target.style.height = `${newHeight}px`;
      e.target.style.overflowY = "hidden";
    }
  };

  return (
    <div className="chat-footer-container">
      <div className="chat-footer">
        <BsThreeDots className="chat-icon me-2" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        <textarea
          className="chat-search-input"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          onInput={handleResize}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          rows="1" // Başlangıçta tek satır olacak
        />
        {/* Tıklanabilir ikon, message içeriği varsa gösterilecek */}
        {message && (
          <BiSolidSend
            className="chat-icon ms-2"
            onClick={handleMessageSend}
          />
        )}
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
