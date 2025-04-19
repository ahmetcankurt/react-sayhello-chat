import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../../redux/slices/friendRequestsSlice";

// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import InviteContactModal from "../../../components/InviteContactModal";
import EmptyStateResult from "../../../components/EmptyStateResult";
import ListHeader from "./ListHeader";
import Contact from "./Contact";

//utils
import { divideByKey } from "../../../utils";

const Index = ({setSelectedUser}) => {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  // Redux verisi
  const { friends, status } = useSelector((state) => state.friendRequests);

  const [contactsData, setContactsData] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Fetch friends
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFriends(userId));
    }
  }, [dispatch, status, userId]);

  // Kontakları harf harfine böl
  useEffect(() => {
    if (friends.length > 0) {
      const filtered = search
        ? friends.filter((c) =>
            c.firstName.toLowerCase().includes(search.toLowerCase())
          )
        : friends;

      const formattedContacts = divideByKey("firstName", filtered);
      setContactsData(formattedContacts);
    }
  }, [friends, search]);

  const onChangeSearch = (value) => {
    setSearch(value);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
 

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
                />
              ))
            )}
          </div>
        </AppSimpleBar>
      </div>
      <InviteContactModal
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default Index;
