import React, { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";

import AppSimpleBar from "../../../components/AppSimpleBar";
import Message from "./Message";
import ForwardModal from "../../../components/ForwardModal";

import { API_URL } from "../../../config";
import { getFormattedDateGroup } from "../../../utils/getFormattedDateGroup";

import { addNewMessageToConversation, setMessagesForContact } from "../../../redux/slices/messagesSlice";

const Conversation = ({
  chatUserDetails,
  onDelete,
  onSetReplyData,
  isChannel,
  selectedUser,
  handleProfileClick,
  setSelectedUser,
}) => {
  const dispatch = useDispatch();
  const userId = Number(localStorage.getItem("userId"));
  const socketRef = useRef(null);
  const ref = useRef();
  const dateRefs = useRef({});

  // Redux'tan conversations'ı al, seçilen kişi/gruba göre mesajları getir
  const conversations = useSelector((state) => state.messages.conversations);
  const contactId = selectedUser?.id ? String(selectedUser.id) : null;
  const messages = contactId && conversations[contactId] ? conversations[contactId] : [];

  const [forwardData, setForwardData] = useState(null);
  const [isOpenForward, setIsOpenForward] = useState(false);
  const [stickyDate, setStickyDate] = useState(null);

  // Mesajları API'den çek ve Redux'a kaydet
  const fetchMessages = useCallback(async () => {
    if (!contactId) return;
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (selectedUser.userType === "group") {
        params.selectedGroup = selectedUser.id;
      } else {
        params.selectedUser = selectedUser.id;
      }
      const { data } = await axios.get(`${API_URL}/messages/list/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      dispatch(setMessagesForContact({ contactId, messages: data.messages }));
      scrollToBottom();
    } catch (error) {
      console.error("Mesajlar alınamadı:", error?.response?.data || error);
    }
  }, [contactId, dispatch, selectedUser]);

  useEffect(() => {
    if (contactId) {
      fetchMessages();
    }
  }, [contactId, fetchMessages]);

  const scrollToBottom = useCallback(() => {
    const container = ref.current?.getScrollElement();
    if (!container) return;

    const lastMessage = container.querySelector(".chat-conversation-list li:last-child");
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
    } else {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    socketRef.current = io(API_URL, {
      auth: { token: localStorage.getItem("token") },
    });

    socketRef.current.emit("joinRoom", String(userId));

    socketRef.current.on("newMessage", (newMessage) => {
      // Normalize
      const normalizedMessage = {
        ...newMessage,
        sender: newMessage.sender || {
          userId: newMessage.senderId,
          name: newMessage.senderName,
          surname: newMessage.senderSurname,
          username: newMessage.senderUsername,
          profileImage: newMessage.senderProfileImage,
        },
      };

      // Redux'a yeni mesaj ekle
      dispatch(addNewMessageToConversation(normalizedMessage));

      scrollToBottom();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [dispatch, userId, scrollToBottom]);

  useEffect(() => {
    if (ref.current) {
      ref.current.recalculate();
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const timeout = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeout);
    }
  }, [messages, scrollToBottom]);

  const onOpenForward = (message) => {
    setForwardData(message);
    setIsOpenForward(true);
  };

  const onCloseForward = () => setIsOpenForward(false);

  const onForwardMessage = async (data) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/messages/forward`,
        {
          ...data,
          forwardedMessage: forwardData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCloseForward();
    } catch (error) {
      console.error("İletme hatası:", error);
    }
  };

  const groupMessagesByDate = (messages) =>
    messages.reduce((groups, msg) => {
      const dateKey = getFormattedDateGroup(msg.createdAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
      return groups;
    }, {});

  const groupedMessages = groupMessagesByDate(messages);

  useEffect(() => {
    const onScroll = () => {
      const container = ref.current?.getScrollElement();
      if (!container) return;

      const scrollTop = container.scrollTop;
      const dates = Object.keys(groupedMessages);

      let current = null;
      for (const date of dates) {
        const el = dateRefs.current[date];
        if (el && scrollTop >= el.offsetTop - container.offsetTop - 100) {
          current = date;
        } else {
          break;
        }
      }
      setStickyDate(current);
    };

    const container = ref.current?.getScrollElement();
    container?.addEventListener("scroll", onScroll);
    onScroll();

    return () => container?.removeEventListener("scroll", onScroll);
  }, [groupedMessages]);

  return (
    <AppSimpleBar scrollRef={ref} className="chat-conversation p-3 pb-0 p-lg-4">
      <ul className="list-unstyled chat-conversation-list position-relative" id="chat-conversation-list">
        {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <React.Fragment key={dateLabel}>
            <li
              ref={(el) => (dateRefs.current[dateLabel] = el)}
              className={`date-label-wrapper ${stickyDate === dateLabel ? "sticky" : ""}`}
              style={{
                position: stickyDate === dateLabel ? "sticky" : "static",
                top: stickyDate === dateLabel ? 75 : "auto",
                zIndex: stickyDate === dateLabel ? 10 : "auto",
              }}
            >
              <span className="date-label">{dateLabel}</span>
            </li>

            {msgs.map((message, index) => {
              const isFromMe = message.senderId === userId;
              return (
                <Message
                  key={message.messageId}
                  message={message}
                  isFromMe={isFromMe}
                  onDelete={onDelete}
                  onSetReplyData={onSetReplyData}
                  onOpenForward={onOpenForward}
                  isChannel={isChannel}
                  handleProfileClick={handleProfileClick}
                  chatUserDetails={chatUserDetails}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  indexInView={index}
                  totalInView={msgs.length}
                />
              );
            })}
          </React.Fragment>
        ))}
      </ul>

      {isOpenForward && (
        <ForwardModal
          isOpen={isOpenForward}
          onClose={onCloseForward}
          forwardData={forwardData}
          chatUserDetails={chatUserDetails}
          onForward={onForwardMessage}
        />
      )}
    </AppSimpleBar>
  );
};

export default Conversation;
