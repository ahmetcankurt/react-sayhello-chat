import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends, deleteFriend } from "../../../redux/slices/friendRequestsSlice";

import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import InviteContactModal from "../../../components/InviteContactModal";
import EmptyStateResult from "../../../components/EmptyStateResult";
import ListHeader from "./ListHeader";
import Contact from "./Contact";

import { divideByKey } from "../../../utils";

import { io } from "socket.io-client";
import { API_URL } from "../../../config";

const socket = io(API_URL);

const FriendsList = ({ setSelectedUser }) => {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  const { friends, status } = useSelector((state) => state.friendRequests);
  const [contactsData, setContactsData] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  
  // Arkadaş listesi veya arama değiştiğinde filtrele ve grupla
  useEffect(() => {
    if (friends && friends.length > 0) {
      const filtered = search
        ? friends.filter((c) =>
          c && c.name && c.name.toLowerCase().includes(search.toLowerCase())
        )
        : friends;

      const formattedContacts = divideByKey("name", filtered);
      setContactsData(formattedContacts || []);
    } else {
      setContactsData([]);
    }
  }, [friends, search]);

  // Socket.io eventleri dinle
  useEffect(() => {
    if (!userId) return;

    socket.emit("joinRoom", userId);

    // Arkadaşlık kabul edilince listeyi güncelle
    socket.on("friendRequestAccepted", () => {
      dispatch(fetchFriends(userId));
    });

    // Arkadaşlık silinince listeyi güncelle
    socket.on("friendRemoved", () => {
      dispatch(fetchFriends(userId));
    });

    return () => {
      socket.off("friendRequestAccepted");
      socket.off("friendRemoved");
    };
  }, [userId, dispatch]);

  // Arama input değişimi
  const onChangeSearch = (value) => {
    setSearch(value);
  };

  // Modal aç/kapa
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleDeleteFriend = async (friendId) => {
    try {
      await dispatch(deleteFriend({ userId, friendId })).unwrap();
    } catch (error) {
      console.error("Arkadaş silme hatası:", error);
    }
  };

  return (
    <>
      <div className="position-relative">
        {status === "loading" && <Loader />}
        <ListHeader
          search={search}
          onChangeSearch={onChangeSearch}
          openModal={openModal}
        />

        <AppSimpleBar className="chat-message-list chat-group-list">
          <div>
            {friends.length === 0 ? (
              <EmptyStateResult searchedText={search} />
            ) : (
              (contactsData || []).map((letterContacts, key) => (
                <Contact
                  letterContacts={letterContacts}
                  key={key}
                  index={key}
                  setSelectedUser={setSelectedUser}
                  onDeleteFriend={handleDeleteFriend} // Silme fonksiyonunu prop olarak geç
                />
              ))
            )}
          </div>
        </AppSimpleBar>
      </div>
      <InviteContactModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
};

export default memo(FriendsList);
