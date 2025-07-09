import { memo, useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, color, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { fetchArchivedMessages, fetchMessages, updateContactList } from "../../../redux/slices/messagesSlice";
import { getUsers } from "../../../redux/slices/userInformation";
import { setActiveTab } from "../../../redux/slices/chatTabsSlice";
import AppSimpleBar from "../../../components/AppSimpleBar";
import { CHATS_TABS } from "../../../constants";
import { API_URL } from "../../../config";
import GroupCreateModal from "./GroupCreateModal";
import Favourites from "./Favourites";


const Index = ({ setSelectedUser }) => {
  const dispatch = useDispatch();
  const { contacts, status, archiveStatus, archivedContacts } = useSelector((state) => state.messages);
  const userId = localStorage.getItem("userId");
  const active = useSelector((state) => state.chatTabs.activeTab);
  const socketRef = useRef(null);

  console.log("Contacts:", contacts);

  useEffect(() => {
    if (!userId) return;

    if (status === "idle") dispatch(fetchMessages());
    if (archiveStatus === "idle") dispatch(fetchArchivedMessages());
  }, [dispatch, status, archiveStatus, userId]);


  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);


  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      socketRef.current = io(API_URL, {
        transports: ["websocket"],
        auth: {
          token: localStorage.getItem("token"),
        },
      });
    }

    socketRef.current.emit("joinRoom", String(userId));

    socketRef.current.on("newMessage", (newMessage) => {
      const isOwnMessage = newMessage.senderId === parseInt(userId);
      dispatch(updateContactList({ message: newMessage, isOwnMessage }));
    });

    // ✅ Yeni grup bildirimi
    socketRef.current.on("newGroupCreated", (groupData) => {
      dispatch(updateContactList({
        message: {
          groupId: groupData.groupId,
          content: groupData.lastMessage,
          createdAt: groupData.createdAt,
          groupName: groupData.name,
          groupImage: groupData.image || null, // Use group image if available
          senderId: groupData.creatorId,
          senderName: groupData.creatorName,
          color: groupData.color , // Default color if not provided
          lastMessageSender: {
            type: "user",
            userId: groupData.creatorId,
            name: groupData.creatorName,
            surname: groupData.creatorSurname,
          },
        },
        isOwnMessage: false,
      }));
    });


    return () => {
      socketRef.current?.off("newMessage");
      socketRef.current?.off("newGroupCreated");
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [dispatch]);


  const searchUsers = () => {
    const inputValue = document.getElementById("serachChatUser");
    const filter = inputValue.value.toUpperCase();
    const ul = document.querySelector(".chat-room-list");
    const li = ul.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++) {
      const a = li[i].getElementsByTagName("a")[0];
      const txtValue = a.textContent || a.innerText;
      li[i].style.display = txtValue.toUpperCase().includes(filter) ? "" : "none";
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const toggleGroupModal = () => setIsGroupModalOpen(!isGroupModalOpen);


  const handleTabChange = (tab) => {
    if (active === tab) {
      dispatch(setActiveTab(CHATS_TABS.DEFAULT)); // aynı tab’a tıklanırsa kapat
    } else {
      dispatch(setActiveTab(tab)); // farklı tab’a tıklanırsa aktif et
    }
  };

  return (
    <>
      <div className="position-relative">
        <div className="px-3 pt-4">
          <div className="d-flex align-items-start">
            <div className="flex-grow-1">
              <h4 className="mb-4">
                {
                  active === CHATS_TABS.DEFAULT ? "Sohbetler" : "Arşivlenmiş Sohbetler"
                }
              </h4>
            </div>
            <div className="flex-shrink-0" >

              <Dropdown isOpen={dropdownOpen} toggle={toggle} >
                <DropdownToggle
                  color="none"
                  className="btn nav-btn text-black "
                  type="button"
                >
                  <i className="bx bx-dots-vertical-rounded"></i>
                </DropdownToggle>
                <DropdownMenu container="body">
                  <DropdownItem
                    className="d-flex justify-content-between align-items-center user-profile-show"
                    onClick={toggleGroupModal}
                  >
                    Grup Oluştur <i className="bx bx-group text-muted"></i>
                  </DropdownItem>

                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <Form>
            <div className="input-group mb-3">
              <Input
                onKeyUp={searchUsers}
                id="serachChatUser"
                type="text"
                className="form-control bg-light border-0 pe-0"
                placeholder="Arama yap..."
              />
              <Button color="light" type="button" id="searchbtn-addon">
                <i className="bx bx-search align-middle"></i>
              </Button>
            </div>
          </Form>
        </div>
        {
          archivedContacts?.length !== 0 &&
          (
            <h5 className="text-center cursor-pointer "  >
              <Link className="font-size-13 text-muted rounded d-flex mb-3 px-3" >
                {active === CHATS_TABS.ARCHIVE ? (
                  <span
                    onClick={() => handleTabChange(CHATS_TABS.ARCHIVE)}
                    className="bg-primary"
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "50px",
                      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      transition: "all 0.3s ease",
                      color: "white",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "white" }}>Sohbetler</span>
                    <i
                      className="bx bx-archive-out"
                      style={{ fontSize: "18px", color: "white" }}
                    />
                  </span>
                ) : (
                  <span
                    onClick={() => handleTabChange(CHATS_TABS.ARCHIVE)}
                    className="bg-primary"
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "50px",
                      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      transition: "all 0.3s ease",
                      color: "white",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "white" }}>
                      Arşivlenmiş
                    </span>
                    <i
                      className="bx bx-archive-in"
                      style={{ fontSize: "18px", color: "white" }}
                    />
                  </span>
                )}
              </Link>
            </h5>
          )}



        <AppSimpleBar className="chat-room-list">
          <AnimatePresence mode="wait">
            {active === CHATS_TABS.DEFAULT && (
              <motion.div
                key="default-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Favourites users={contacts} setSelectedUser={setSelectedUser} userId={userId} activeTab={active}/>
              </motion.div>
            )}

            {active === CHATS_TABS.ARCHIVE && (
              <motion.div
                key="archive-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {archivedContacts.length === 0 ? (
                  <p className="text-center text-muted">
                    Arşivlenmiş sohbet bulunmamaktadır.
                    <br />
                    <Link onClick={() => handleTabChange(CHATS_TABS.ARCHIVE)} className="text-primary">
                      Sohbetlere dön
                    </Link>
                  </p>
                ) : (
                  <Favourites users={archivedContacts} setSelectedUser={setSelectedUser} userId={userId}  activeTab={active}/>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </AppSimpleBar>

      </div >
      <GroupCreateModal isOpen={isGroupModalOpen} toggle={toggleGroupModal} />
    </>
  );
};

export default memo(Index);