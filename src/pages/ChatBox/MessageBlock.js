import { memo, useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import formatTime from "../../hooks/formatTime";
import { motion } from "framer-motion";
import ISReady from "../../Component/ISRead";
import axios from "axios";
import { API_URL } from "../../config";
import { FaChevronUp, FaReply, FaTrash } from "react-icons/fa";

function MessageBlock({ message, userId, handleUpdate, messages }) {
  const messageRef = useRef(null);
  const messagesEndRef = useRef(null);



  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && message.receiverId === userId && !message.isRead) {
            axios.put(`${API_URL}/messages/read/${message.messageId}`)
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

      <div>
        <motion.div
          ref={messageRef}
          key={message.messageId}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="d-flex"
        >
          <div>

            {message.senderId === userId && !message.isDeleted && (
              <div className="dots-container">
                <div className="dropdown dropup">
                  <BsThreeDotsVertical
                    data-bs-toggle="dropdown"
                    className="chat-dots-icon"
                  />
                  <div className="dropdown-menu">
                    <FaTrash
                      className="dropdown-chat-icon"
                      onClick={() => handleUpdate(message.messageId)}
                    />
                    {/* <FaReply className="dropdown-chat-icon" /> */}
                  </div>
                </div>
              </div>

            )}
          </div>
          <div>

            <p className={`message-content ${message.senderId === userId ? 'senderId' : 'receiverId'} ${message.isDeleted && "message-isDeleted"}`}>

              {message.isDeleted ? "🚫 Bu mesaj silindi" : message.content}
            </p>
            {message.senderId === userId && <ISReady className="me-1" isRead={message.isRead} />}
            <span className="message-clock">{formatTime(message.createdAt)}</span>
          </div>
        </motion.div>


      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}

export default memo(MessageBlock);