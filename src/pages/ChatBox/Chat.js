import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import MessageItem from "./MessageItem";
import { groupMessagesByDate } from "./groupMessagesByDate";
import { API_URL } from "../../config";
import { motion } from "framer-motion";
import "./ChatBox.css";


const Chat = ({ selectedUser, handleProfileClick, setSelectedUser }) => {
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);
  const socketRef = useRef(null);
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages/${userId}/${selectedUser}`);
        setMessages(response.data.messages.reverse());
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    fetchMessages();
  }, [userId, selectedUser]);

  const handleUpdate = useCallback(async (messageId) => {
    try {
      await axios.put(`${API_URL}/messages/update/${messageId}`);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, isDeleted: true } : msg
        )
      );

      socketRef.current.emit("messageDeleted", { messageId });
    } catch (error) {
      console.error("Error updating message", error);
    }
  }, []);

  useEffect(() => {
    socketRef.current = io(API_URL);

    socketRef.current.on("newMessage", (message) => {
      if (!message.messageId) {
        message.messageId = `${message.senderId}-${message.createdAt}`;
      }

      if (
        (message.senderId === userId && message.receiverId === selectedUser) ||
        (message.senderId === selectedUser && message.receiverId === userId)
      ) {
        setMessages((prev) => {
          // Check if the message already exists in the list
          if (!prev.some(msg => msg.messageId === message.messageId)) {
            return [...prev, message];
          }
          return prev;
        });
      }
    });

    socketRef.current.on("messageDeleted", (deletedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          Number(msg.messageId) === Number(deletedMessage.messageId) ? { ...msg, isDeleted: true } : msg
        )
      );
    });

    socketRef.current.on("messageRead", ({ messageId, isRead }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          Number(msg.messageId) === Number(messageId) ? { ...msg, isRead } : msg
        )
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, selectedUser]);

  const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);

  const clearSelectedUser = () => setSelectedUser(null);

  // Scroll to the bottom of the chat box only when the user is already at the bottom
  const scrollToBottom = useCallback(() => {
    if (chatBoxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        chatBoxRef.current.scrollTop = scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="chat-container">
      <div className="header">
        <ChatHeader selectedUser={selectedUser} handleProfileClick={handleProfileClick} clearSelectedUser={clearSelectedUser} />
      </div>
      <div className="main-chat" ref={chatBoxRef}>
        {Object.keys(groupedMessages).map((date, index) => (
          <Fragment key={date}>
            <motion.div
              key={date + "date"}
              className="date-separator"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="date-separator-text">{date}</span>
            </motion.div>

            {groupedMessages[date].map((message, idx) => (
              <MessageItem
                message={message}
                key={`${date}-${index}-${idx}`}
                userId={userId}
                handleUpdate={handleUpdate}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div className="footer">
        <ChatFooter selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default memo(Chat);