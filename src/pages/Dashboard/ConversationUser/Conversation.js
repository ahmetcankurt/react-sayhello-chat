import React, { useEffect, useRef, useCallback, useState } from "react";
import axios from "axios";
import AppSimpleBar from "../../../components/AppSimpleBar";
import Loader from "../../../components/Loader";
import Message from "./Message";
import ForwardModal from "../../../components/ForwardModal";
import { io } from "socket.io-client";
import { API_URL } from "../../../config";

const Conversation = ({ chatUserDetails, onDelete, onSetReplyData, isChannel, selectedUser, handleProfileClick, setSelectedUser }) => {
  const [messages, setMessages] = useState([]);
  const userId = Number(localStorage.getItem("userId"));
  const socketRef = useRef(null);
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
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const params = {};
        if (selectedUser?.id) {
          // Eğer userType belirtilmemişse varsayılan olarak birebir mesaj kabul edin
          if (selectedUser.userType === "group") {
            params.selectedGroup = selectedUser.id;
          } else {
            params.selectedUser = selectedUser.id;
          }
        }


        const response = await axios.get(`${API_URL}/messages/list/users`, {
          headers: { Authorization: `Bearer ${token}` },
          params: params,
        });
        console.log(response.data)
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Request error:", {
          url: error.config?.url,
          params: error.config?.params,
          response: error.response?.data
        });
      }
    };

    if (selectedUser?.id) {
      fetchMessages();
    }
  }, [userId, selectedUser]);


  const handleUpdate = useCallback(async (messageId) => {
    try {
      const token = localStorage.getItem("token"); // veya token'ı nerede tutuyorsan

      await axios.put(`${API_URL}/messages/update/${messageId}`, {},
        {
          headers: {
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
    socketRef.current = io(API_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    if (userId) {
      socketRef.current.emit("joinRoom", String(userId));
    }

    socketRef.current.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollElement();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, scrollElement]);



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
  };


  return (
    <AppSimpleBar scrollRef={ref} className="chat-conversation p-3 pb-0 p-lg-4 positin-relative">
      <ul className="list-unstyled chat-conversation-list" id="chat-conversation-list">
        {(messages || []).map((message, key) => {
          const isFromMe = message?.senderId === userId;
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
              handleProfileClick={handleProfileClick}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
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
