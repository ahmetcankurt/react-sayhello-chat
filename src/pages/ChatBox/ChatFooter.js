import { memo, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import axios from "axios"
import { io } from "socket.io-client";  // Socket.IO istemcisi
const socket = io("http://localhost:3000");

function ChatFooter({ selectedUser }) {
  const [message, setMessage] = useState('');

  const userId = localStorage.getItem("userId");


  const handleMessageSend = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/messages', {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
      });

      // Mesajı Socket.IO ile anında göndermek
      socket.emit('newMessage', {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
        createdAt: new Date().toISOString()
      });

      setMessage('');
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    }
  };

  return (
    <div className="chat-footer">
      <BsThreeDots className="chat-icon" />
      <input className="chat-search-input" value={message} onChange={(e) => setMessage(e.target.value)} />
      <BiSolidSend className="chat-icon" onClick={handleMessageSend} />
    </div>
  );
}

export default memo(ChatFooter) ;