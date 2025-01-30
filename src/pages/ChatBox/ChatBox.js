import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";  // Socket.IO istemcisi
import axios from 'axios'; // API çağrısı için axios

import "./ChatBox.css";
import MessageBlock from "./MessageBlock";

const socket = io("http://localhost:3000");

function ChatBox({ selectedUser }) {
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [messages, setMessages] = useState([]); // Mesajlar state'i
  const [isRead, setIsRead] = useState(true);
  const userId = localStorage.getItem("userId");
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/messages/${userId}/${selectedUser}`);
          setMessages(response.data.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        } catch (error) {
          console.error("Mesajları alma hatası:", error);
        }
      };
      fetchMessages();
    }
  }, [selectedUser]);


  useEffect(() => {
    socket.on('newMessage', (message) => {
      if (
        (message.senderId == userId && message.receiverId == selectedUser) ||
        (message.senderId == selectedUser && message.receiverId == userId)
      ) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [userId, selectedUser]); // `userId` ve `selectedUser` bağımlılık olarak eklenmeli

  const sortedMessages = useMemo(
    () => messages.slice().reverse(),
    [messages]
  );

  const toggleDropdown = useCallback(
    (index) => {
      setDropdownVisible((prev) => (prev === index ? null : index));
    }, []);

  console.log("render ChatBox",messages )
  return (
    <div className="chat-box" ref={chatBoxRef}>
      {sortedMessages.map((message, index) => (
        <MessageBlock key={message._id} message={message} index={index} isRead={isRead} toggleDropdown={toggleDropdown} dropdownVisible={dropdownVisible} userId={userId} />
      ))}
    </div>
  );
}

export default memo(ChatBox)