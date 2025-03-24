import React, { memo, useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../redux/slices/messagesSlice";
import SearchInput from "../../Component/input/searchInput";
import UserImage from "../../Component/UserImage";
import ScrollContainer from "../../Component/ScrollContainer";
import ISRead from "../../Component/ISRead";
import { capitalize } from "../../utils/stringUtils";
import io from "socket.io-client";
import "./Mymessages.css";
import { API_URL } from "../../config";
import { Fancybox } from "@fancyapps/ui";

// Kısa mesaj fonksiyonu
const getShortenedMessage = (message, maxLength = 20) =>
  message?.length > maxLength ? `${message.slice(0, maxLength)}...` : message;

// Message bileşeni
const Messages = memo(({ message, setSelectedUser, selectedUser }) => {
  const { lastMessage, name, surname, userId, profileImage, isActive, lastMessageSender, isRead } = message;
  const shortenedMessage = getShortenedMessage(lastMessage);
  const isActiveUser = userId === selectedUser;
  const Name = capitalize(name);
  const Surname = capitalize(surname);

  const handleClick = useCallback(() => {
    setSelectedUser(userId);
  }, [setSelectedUser, userId]);

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      Toolbar: false, // Üst menüyü kapatır
      smallBtn: true, // Küçük kapatma butonu gösterir
    });

    return () => {
      Fancybox.unbind("[data-fancybox]");
    };
  }, []);

  return (
    <div className={`messages-blog ${isActiveUser ? "active" : ""}`} >
      <a data-fancybox={`user-${userId}`} href={`${API_URL}/${profileImage}`}>
        <UserImage height="50" width="50" src={profileImage} isActive={isActive} />
      </a>
      <div onClick={handleClick}>
        <span>{Name} {Surname}</span>
        <p className="messages-detail m-0">
          {
            lastMessageSender === "ben" ? (
              <span>
                <ISRead isRead={isRead} />
                <span className="ms-1" style={{ color: "#555" }}>
                  {shortenedMessage}
                </span>
              </span>
            ) : (
              <span
                className="ms-1"
                style={{
                  color: isRead ? "#555" : "black",
                  fontWeight: isRead ? "normal" : "bold"
                }}
              >
                {shortenedMessage}
              </span>
            )
          }
        </p>
      </div>
    </div>
  );
});

// Index bileşeni
function Index({ selectedUser, setSelectedUser }) {
  const dispatch = useDispatch();
  const { messages, status, error } = useSelector((state) => state.messages);
  const [searchTerm, setSearchTerm] = useState("");

  // Socket bağlantısını sadece bir kere oluşturmak için useMemo kullanıyoruz.
  const socket = useMemo(() => io(API_URL), []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMessages());
    }
  }, [dispatch, status]);

  // "newMessage" olayını dinleyerek mesaj listesini güncelle
  useEffect(() => {
    socket.on("newMessage", (updatedMessage) => {
      dispatch(fetchMessages());
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, dispatch]);

  // "messageRead" olayını dinleyerek mesajın okunma durumunu güncelle
  useEffect(() => {
    socket.on("messageRead", ({ messageId, isRead }) => {
      // İsteğe bağlı olarak, sadece ilgili mesajı güncelleyebilirsiniz.
      // Şimdilik tüm listeyi yeniden çekiyoruz.
      dispatch(fetchMessages());
    });

    return () => {
      socket.off("messageRead");
    };
  }, [socket, dispatch]);

  // Arama filtresi
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMessages = messages.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let content;
  if (status === "loading") {
    content = <div></div>;
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
        <div className="mx-2 mb-2">
          <SearchInput searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
        </div>
      </div>
      <ScrollContainer paddingBottom="80px">{content}</ScrollContainer>
    </div>
  );
}

export default memo(Index);
