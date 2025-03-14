import { memo, useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import formatTime from "../../hooks/formatTime";
import Dropdown from "./Dropdown";
import { motion } from "framer-motion";
import ISReady from "./ISReady";
import axios from "axios";
import { API_URL } from "../../config";

function MessageBlock({ message, userId, handleUpdate, messages }) {
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const messageRef = useRef(null);
  const messagesEndRef = useRef(null);

  const toggleDropdown = (messageId) => {
    setDropdownVisible((prev) => (prev === messageId ? null : messageId));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && message.receiverId === userId && !message.isRead) {
            axios.put(`${API_URL}/messages/read/${message.messageId}`)
              .then(() => {
                console.log("Mesaj okundu olarak işaretlendi.");
              })
              .catch((error) => {
                console.error("Mesaj okunma durumu güncellenirken hata:", error);
              });
          }
        });
      },
      { threshold: 1.0 }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, [message, userId]);

  useEffect(() => {
    if (message.senderId === userId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, message.senderId, userId]);



  return (
    <div className={`message ${message.senderId === userId ? 'senderId' : 'receiverId'}`}>
      {message.senderId === userId && !message.isDeleted && (
        <>
          <Dropdown
            visible={dropdownVisible === message.messageId}
            onDelete={() => handleUpdate(message.messageId)}
          />
          <BsThreeDotsVertical
            className="chat-dots-icon"
            onClick={() => toggleDropdown(message.messageId)}
          />

        </>
      )}
      <div>
        <motion.div
          ref={messageRef}
          key={message.messageId}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <p className={`message-content ${message.senderId === userId ? 'senderId' : 'receiverId'} ${message.isDeleted && "message-isDeleted"}`}>
            {message.isDeleted ? "🚫 Bu mesaj silindi" : message.content}
          </p>
          {message.senderId === userId && <ISReady isRead={message.isRead} />}
          <span className="message-clock">{formatTime(message.createdAt)}</span>
        </motion.div>


      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}

export default memo(MessageBlock);