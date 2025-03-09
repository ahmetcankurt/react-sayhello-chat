import { memo, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import NewMessageAlert from "./NewMessageAlert";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import MessageBlock from "./MessageBlock";
import SplashScreen from "../../Component/SplashScreen"
import "./ChatBox.css";

const Chat = ({ selectedUser, handleProfileClick, setSelectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const chatBoxRef = useRef(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const userId = Number(localStorage.getItem("userId"));

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/messages/${userId}/${selectedUser}`)
      .then((response) => {
        setMessages(response.data.messages.reverse());
        setLoading(false); // Veriler yüklendi, yükleme durumunu false yap
      })
      .catch((error) => {
        console.error("API çağrısı hatası:", error);
        setLoading(false); // Hata durumunda da yükleme durumunu false yap
      });
  }, [userId, selectedUser]);

  const handleUpdate = useCallback(async (messageId) => {
    try {
      await axios.put(`http://localhost:3000/messages/update/${messageId}`);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, isDeleted: true } : msg
        )
      );

      socketRef.current.emit("messageDeleted", { messageId });
    } catch (error) {
      console.error("Mesaj silinirken hata oluştu:", error);
    }
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("newMessage", (message) => {
      if (!message.messageId) {
        message.messageId = `${message.senderId}-${message.createdAt}`;
      }

      if (
        (message.senderId === userId && message.receiverId === selectedUser) ||
        (message.senderId === selectedUser && message.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, message]);

        if (message.receiverId === userId && !message.isRead) {
          setNewMessageAlert(true);
        }
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

      if (isRead) {
        setNewMessageAlert(false);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, selectedUser]);

  const handleNewMessageAlertClick = () => {
    scrollToBottom();
    setNewMessageAlert(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (chatBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
        if (scrollHeight - scrollTop === clientHeight) {
          setNewMessageAlert(false);
        }
      }
    };

    const chatBoxElement = chatBoxRef.current;
    if (chatBoxElement) {
      chatBoxElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatBoxElement) {
        chatBoxElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const clearSelectedUser = () => setSelectedUser(null);

  if (loading) {
    return 
  }

  return (
    <div className="chat-container">
      <ChatHeader selectedUser={selectedUser} handleProfileClick={handleProfileClick} clearSelectedUser={clearSelectedUser} />

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((message, index) => (
          <MessageBlock
            message={message}
            key={`${message.senderId}-${message.createdAt}-${index}`}
            index={index}
            userId={userId}
            handleUpdate={handleUpdate}
          />
        ))}
      </div>

      <NewMessageAlert newMessageAlert={newMessageAlert} handleNewMessageAlertClick={handleNewMessageAlertClick} />

      <ChatFooter selectedUser={selectedUser} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default memo(Chat);