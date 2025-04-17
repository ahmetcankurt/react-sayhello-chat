import { memo, useState, useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import axios from "axios";
import { io } from "socket.io-client";
import { API_URL } from "../../config";

function ChatFooter({ selectedUser }) {
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const socketRef = useRef(null);
  const initialHeightRef = useRef(null);
  const userId = Number(localStorage.getItem("userId"));
  const maxMessageLength = 280; // Max character limit for the message

  useEffect(() => {
    socketRef.current = io(API_URL);
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight;
      setViewportHeight(newHeight);
      if (newHeight < initialHeightRef.current - 100) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const handleMessageSend = async () => {
    if (!message.trim() || message.length > maxMessageLength || isSending) return;
    setIsSending(true);
    try {
      const response = await axios.post(`${API_URL}/messages`, {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
      });
  
      // Emit the message to both sender and receiver
      socketRef.current.emit('newMessage', {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
        createdAt: new Date().toISOString(),
        messageId: response.data.messageId
      });
  
      // Reset message input
      setMessage('');
      const textarea = document.querySelector(".chat-search-input");
      if (textarea) {
        textarea.style.height = "auto";
      }
    } catch (error) {
      console.error("Message send error", error);
    } finally {
      setIsSending(false);
    }
  };
  
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.repeat) {
      e.preventDefault();
      handleMessageSend();
    }
  };

  const handleMessageChange = (e) => {
    if (e.target.value.length <= maxMessageLength) {
      setMessage(e.target.value);
    }
  };

  const handleResizeTextarea = (e) => {
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
    <div className="chat-footer-container" style={{ height: isKeyboardOpen ? viewportHeight : "auto" }}>
      <div className="chat-footer">
        <BsThreeDots className="chat-icon me-2" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        <textarea
          className="chat-search-input"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          onInput={handleResizeTextarea}
          onFocus={() => window.scrollTo(0, document.body.scrollHeight)}
          onBlur={() => window.scrollTo(0, 0)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          rows="1"
        />
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
      {message.length > maxMessageLength && (
        <div className="message-limit-warning">
          <p>⚠️ Mesaj uzunluğu {maxMessageLength} karakteri geçti!</p>
        </div>
      )}
    </div>
  );
}

export default memo(ChatFooter);
