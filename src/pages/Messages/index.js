import React, { memo, useEffect, useCallback ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd } from "react-icons/md";
import { fetchMessages } from "../../redux/slices/messagesSlice";
import SearchInput from "../../Component/input/searchInput";
import UserImage from "../../Component/UserImage";
import "./Mymessages.css";
import ScrollContainer from "../../Component/ScrollContainer";

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
      <UserImage height={"55px"} src={profileImage} isActive={isActive} />
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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMessages());
    }
  }, [dispatch, status]);

  // Arama filtresi
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMessages = messages.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let content;
  if (status === "loading") {
    content = <></>
  } else if (status === "failed") {
    content = <div>{error}</div>;
  } else {
    content = filteredMessages.map((message) => (
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
      <div className="bg">
        <div className="Mymessages-add">
          <span className="Mymessages-title">Mesajlarım</span>
        </div>
        <SearchInput searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      </div>
      <ScrollContainer paddingBottom="80px">{content}</ScrollContainer>
    </div>
  );
}

export default memo(Index);