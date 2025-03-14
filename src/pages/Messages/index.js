import React, { memo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd } from "react-icons/md";
import { fetchMessages } from "../../redux/slices/messagesSlice";
import SearchInput from "../../Component/input/searchInput";
import UserImage from "../../Component/UserImage";
import "./Mymessages.css";

// Kısa mesaj fonksiyonu
const getShortenedMessage = (message, maxLength = 20) =>
  message?.length > maxLength ? `${message.slice(0, maxLength)}...` : message;

// Message bileşeni (memo ile sarmalandı)
const Messages = memo(({ message, setSelectedUser, selectedUser }) => {
  const { lastMessage, name, surname, userId, profileImage, isActive, lastMessageSender } = message;
  const shortenedMessage = getShortenedMessage(lastMessage);
  const isActiveUser = userId === selectedUser;

  const handleClick = useCallback(() => {
    setSelectedUser(userId);
  }, [setSelectedUser, userId]);

  return (
    <div className={`messages-blog ${isActiveUser ? "active" : ""}`} onClick={handleClick}>
      <UserImage src={profileImage} isActive={isActive}  />
      <div>
        <span>{name} {surname}</span>
        <p className="messages-detail m-0">{lastMessageSender} : {shortenedMessage}</p>
      </div>
    </div>
  );
});

// Index bileşeni
function Index({ selectedUser, setSelectedUser }) {
  const dispatch = useDispatch();
  const { messages, status, error } = useSelector((state) => state.messages);

  useEffect(() => {
    // İlk başta sadece "idle" durumunda istek atıyoruz.
    if (status === "idle") {
      dispatch(fetchMessages());
    }
  }, [dispatch, status]);

  let content;
  if (status === "loading") {
    content = <div></div>;
  } else if (status === "failed") {
    content = <div>{error}</div>;
  } else {
    content = messages.map((message) => (
      <Messages
        key={message.userId}
        message={message}
        setSelectedUser={setSelectedUser}
        selectedUser={selectedUser}
      />
    ));
  }

  return (
    <div>
      <div className="Mymessages-add">
        <span className="Mymessages-title">Mesajlarım</span>
        <MdAdd className="Mymessages-icon" />
      </div>
      <SearchInput />
      {content}
    </div>
  );
}

export default memo(Index);