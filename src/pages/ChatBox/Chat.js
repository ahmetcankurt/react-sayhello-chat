import { Fragment, memo, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import MessageBlock from "./MessageBlock";
import { groupMessagesByDate } from "./groupMessagesByDate";
import { API_URL } from "../../config";
import { motion } from "framer-motion";
import SplashScreen from "../../Component/SplashScreen";
import "./ChatBox.css";
import "./chatBox-scrool.css";


const Chat = ({ selectedUser, handleProfileClick, setSelectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const chatBoxRef = useRef(null);
  const socketRef = useRef(null);
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    axios
      .get(`${API_URL}/messages/${userId}/${selectedUser}`)
      .then((response) => {
        setMessages(response.data.messages.reverse());
        setLoading(false); // Veriler yüklendi, yükleme durumunu false yap
      })
      .catch((error) => {
        setLoading(false); // Hata durumunda da yükleme durumunu false yap
      });
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
        setMessages((prev) => [...prev, message]);
      }
    });

    socketRef.current.on("messageDeleted", (deletedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId == deletedMessage.messageId ? { ...msg, isDeleted: true } : msg
        )
      );
    });

    socketRef.current.on("messageRead", ({ messageId, isRead }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId == messageId ? { ...msg, isRead } : msg
        )
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, selectedUser]);

  const groupedMessages = groupMessagesByDate(messages)

  const clearSelectedUser = () => setSelectedUser(null)

  // Scroll to the bottom of the chat box
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }

  // Mesajlar güncellenince de sayfayı aşağı kaydır
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return <SplashScreen />
  }


  return (
    <div className="chat-container">
      <div className="header">
        <ChatHeader selectedUser={selectedUser} handleProfileClick={handleProfileClick} clearSelectedUser={clearSelectedUser} />
      </div>
      {/* <div className="main-chat">
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
              <MessageBlock
                message={message}
                key={`${date}-${index}-${idx}`}
                userId={userId}
                handleUpdate={handleUpdate}
              />
            ))}
          </Fragment>
        ))}
        </div> */}
      <div className="footer">
      <ChatFooter selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default memo(Chat);