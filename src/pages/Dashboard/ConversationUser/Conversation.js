import React, { useEffect, useRef, useCallback, useState } from "react";
import axios from "axios";
import AppSimpleBar from "../../../components/AppSimpleBar";
import Loader from "../../../components/Loader";
import Message from "./Message";
import ForwardModal from "../../../components/ForwardModal";
import { io } from "socket.io-client";
import {API_URL} from "../../../config";

const Conversation = ({ chatUserDetails, onDelete, onSetReplyData, isChannel, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const userId = Number(localStorage.getItem("userId"));
  const socketRef = useRef(null);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages/${userId}/${selectedUser}`);
        setMessages(response.data.messages.reverse());  // Reverse to show the most recent messages at the bottom
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    fetchMessages();
  }, [userId, selectedUser]);

  const handleUpdate = useCallback(async (messageId) => {
    try {
      const token = localStorage.getItem("token"); // veya token'ı nerede tutuyorsan
  
      await axios.put(`${API_URL}/messages/update/${messageId}`,{},
        { headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
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
    
      // Eğer sender objesi yoksa, temel şekilde oluştur.
      if (!message.sender) {
        message.sender = { userId: message.senderId };
      }
    
      if (
        (message.senderId === userId && message.receiverId === selectedUser) ||
        (message.senderId === selectedUser && message.receiverId === userId)
      ) {
        setMessages((prev) => {
          if (!prev.some(msg => msg.messageId === message.messageId)) {
            return [...prev, message];
          }
          return prev;
        });
      }
    });
    
    
    socketRef.current.on("messageDeleted", (deletedMessage) => {
      const deletedId = deletedMessage?.messageId?.toString();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId.toString() === deletedId 
            ? { 
                ...msg, 
                isDeleted: true,
                content: deletedMessage.content || "🚫 Bu mesaj silindi"
              } 
            : msg
        )
      );
    });
    

    socketRef.current.on("messageRead", ({ messageId, isRead }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === Number(messageId) ? { ...msg, isRead } : msg
        )
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, selectedUser]);
  

  
  const ref = useRef();
  const scrollElement = useCallback(() => {
    if (ref && ref.current) {
      const listEle = document.getElementById("chat-conversation-list");
      let offsetHeight = 0;
      if (listEle) {
        offsetHeight = listEle.scrollHeight - window.innerHeight + 250;
      }
      if (offsetHeight) {
        ref.current.getScrollElement().scrollTo({ top: offsetHeight, behavior: "smooth" });
      }
    }
  }, [ref]);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.recalculate();
    }
  }, []);

  useEffect(() => {
    if (messages) {
      scrollElement();
    }
  }, [messages, scrollElement]);

  const [forwardData, setForwardData] = useState();
  const [isOpenForward, setIsOpenForward] = useState(false);

  const onOpenForward = (message) => {
    setForwardData(message);
    setIsOpenForward(true);
  };

  const onCloseForward = () => {
    setIsOpenForward(false);
  };

  const onForwardMessage = (data) => {
    const params = {
      contacts: data.contacts,
      message: data.message,
      forwardedMessage: forwardData,
    };
    // Implement forwarding logic here
  };

  return (
    <AppSimpleBar scrollRef={ref} className="chat-conversation p-3 pb-0 p-lg-4 positin-relative">
      <ul className="list-unstyled chat-conversation-list" id="chat-conversation-list">
        {(messages || []).map((message, key) => {
          const isFromMe = message.sender?.userId === userId;
          return (
            <Message
              message={message}
              key={message.messageId} 
              chatUserDetails={chatUserDetails}
              onDelete={onDelete}
              onSetReplyData={onSetReplyData}
              isFromMe={isFromMe}
              onOpenForward={onOpenForward}
              isChannel={isChannel}
              handleUpdate={handleUpdate}
            />
          );
        })}
      </ul>
      {isOpenForward && (
        <ForwardModal isOpen={isOpenForward} onClose={onCloseForward} forwardData={forwardData} chatUserDetails={chatUserDetails} onForward={onForwardMessage} />
      )}
    </AppSimpleBar>
  );
};

export default Conversation;
