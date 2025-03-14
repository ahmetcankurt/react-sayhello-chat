import { Fragment, memo, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import MessageBlock from "./MessageBlock";
import { groupMessagesByDate } from "./groupMessagesByDate";
import { API_URL } from "../../config";
import "./ChatBox.css";
import ScrollContainer from "../../Component/ScrollContainer";

const Chat = ({ selectedUser, handleProfileClick, setSelectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [newMessageNotification, setNewMessageNotification] = useState(false); // Yeni mesaj bildirimi
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
        console.error("API çağrısı hatası:", error);
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
      console.error("Mesaj silinirken hata oluştu:", error);
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
        if (message.senderId !== userId) {
          setNewMessageNotification(true); // Yeni mesaj geldiğinde bildirimi göster
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
      setNewMessageNotification(false); // Mesaj okunduğunda bildirimi kaldır
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, selectedUser]);

  const groupedMessages = groupMessagesByDate(messages);

  const clearSelectedUser = () => setSelectedUser(null);

  // Scroll to the bottom of the chat box
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  // Yeni mesaj bildirimi tıklandığında sayfayı aşağı kaydır
  const handleNotificationClick = () => {
    setNewMessageNotification(false); // Yeni mesaj bildirimi kapanır
    scrollToBottom(); // Sayfanın altına kaydır
  };

  // Mesajlar güncellenince de sayfayı aşağı kaydır
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return 
  }

  return (
    <div className="chat-container">
      <ChatHeader selectedUser={selectedUser} handleProfileClick={handleProfileClick} clearSelectedUser={clearSelectedUser} />
      {newMessageNotification && (
        <div className="new-message-notification" onClick={handleNotificationClick}>
          Yeni mesajınız var!
        </div>
      )}
      <ScrollContainer className="chat-box" ref={chatBoxRef}>
        {Object.keys(groupedMessages).map((date, index) => (
          <Fragment key={date}>
            <div className="date-separator">
              <span className="date-separator-text">
                {date}
              </span>
            </div>
            {groupedMessages[date].map((message, idx) => (
              <Fragment key={message.messageId}>
                {message.isRead === false && (
                  <div className="messagedeneme">
                    <span className="message-read-text">Okunmadı</span>
                  </div>
                )}
                <MessageBlock
                  message={message}
                  key={`${date}-${index}-${idx}`}
                  index={index}
                  userId={userId}
                  handleUpdate={handleUpdate}
                />
              </Fragment>
            ))}
          </Fragment>
        ))}
      </ScrollContainer>
      <ChatFooter selectedUser={selectedUser} />
    </div>
  );
};

export default memo(Chat);
