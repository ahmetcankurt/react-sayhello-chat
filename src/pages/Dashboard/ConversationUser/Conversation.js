import React, { useEffect, useRef, useCallback, useState, memo } from "react";
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
  isChannel,
  selectedUser,
  handleProfileClick,
  setSelectedUser,
  setReplyData
}) => {
  const dispatch = useDispatch();
  const userId = Number(localStorage.getItem("userId"));
  const socketRef = useRef(null);
  const ref = useRef();
  const dateRefs = useRef({});
  const token = localStorage.getItem("token");
  const conversations = useSelector((state) => state.messages.conversations);
  const contactId = selectedUser?.id ? String(selectedUser.id) : null;
  const messages = contactId && conversations[contactId] ? conversations[contactId] : [];

  const [forwardData, setForwardData] = useState(null);
  const [isOpenForward, setIsOpenForward] = useState(false);
  const [stickyDate, setStickyDate] = useState(null);

  // Mesajları API'den çek
  const fetchMessages = useCallback(async () => {
    if (!contactId) return;
    try {
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
  }, [contactId, dispatch, selectedUser, token]);

  useEffect(() => {
    if (contactId) fetchMessages();
  }, [contactId, fetchMessages]);

  // Scroll fonksiyonu
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

  // Socket.io ile yeni mesaj alma
  useEffect(() => {
    socketRef.current = io(API_URL, { auth: { token } });
    socketRef.current.emit("joinRoom", String(userId));

    socketRef.current.on("newMessage", (newMessage) => {
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
      dispatch(addNewMessageToConversation(normalizedMessage));
      scrollToBottom();
    });

    return () => socketRef.current.disconnect();
  }, [dispatch, userId, scrollToBottom, token]);

  // Görünür mesajları tarih bazında grupla
  const visibleMessages = messages.filter(msg => msg.isVisible !== false);
  const groupMessagesByDate = (msgs) =>
    msgs.reduce((groups, msg) => {
      const dateKey = getFormattedDateGroup(msg.createdAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
      return groups;
    }, {});

  const groupedMessages = groupMessagesByDate(visibleMessages);

  // Mesaj silme
  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.patch(
        `${API_URL}/messages/${messageId}/visibility`,
        { visible: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(
        setMessagesForContact({
          contactId,
          messages: conversations[contactId].map((msg) =>
            msg.messageId === messageId ? { ...msg, isVisible: false } : msg
          ),
        })
      );
    } catch (error) {
      console.error("Mesaj gizleme hatası:", error);
    }
  };

  // Forward fonksiyonları
  const onOpenForward = (message) => {
    setForwardData(message);
    setIsOpenForward(true);
  };
  const onCloseForward = () => setIsOpenForward(false);
  const onForwardMessage = async (data) => {
    try {
      await axios.post(
        `${API_URL}/messages/forward`,
        { ...data, forwardedMessage: forwardData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCloseForward();
    } catch (error) {
      console.error("İletme hatası:", error);
    }
  };

  // Sticky date için scroll event
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
      <ul className="list-unstyled chat-conversation-list position-relative">
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

              // Cevaplanan mesajı bul (replyToId ile)
              const repliedMessage = messages.find(m => m.messageId === message.replyToId);

              return (
                <Message
                  key={message.messageId}
                  id={`message-${message.messageId}`}
                  message={message}
                  repliedMessage={repliedMessage}
                  isFromMe={isFromMe}
                  onDelete={handleDeleteMessage}
                  onOpenForward={onOpenForward}
                  isChannel={isChannel}
                  handleProfileClick={handleProfileClick}
                  chatUserDetails={chatUserDetails}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  indexInView={index}
                  totalInView={msgs.length}
                  setReplyData={setReplyData}
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

export default memo(Conversation);
