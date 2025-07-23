import { memo, useEffect, useRef, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import AppSimpleBar from "../../../components/AppSimpleBar";
import GroupCreateModal from "./GroupCreateModal";
import Favourites from "./Favourites";
import { CHATS_TABS, SOCKET_EVENTS } from "../../../constants";
import { API_URL } from "../../../config";
import {
  fetchMessages,
  updateContactList,
} from "../../../redux/slices/messagesSlice";
import { setActiveTab } from "../../../redux/slices/chatTabsSlice";

const Index = ({ setSelectedUser }) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const { contacts, archivedContacts } = useSelector((state) => state.messages);
  const activeTab = useSelector((state) => state.chatTabs.activeTab);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Mesajları yükle
  useEffect(() => {
    if (!userId) return;
    dispatch(fetchMessages());
  }, [dispatch, userId]);

  // Socket kurulumu
  useEffect(() => {
    if (!userId || socketRef.current) return;

    const socket = io(API_URL, {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("token") },
    });
    socketRef.current = socket;

    socket.emit("joinRoom", String(userId));

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (message) => {
      console.log("users mesajı ", message)
      dispatch(updateContactList({
        message,
        isOwnMessage: message.senderId === parseInt(userId),
      }));
    });

    socket.on(SOCKET_EVENTS.NEW_GROUP, (group) => {
      dispatch(updateContactList({
        message: {
          groupId: group.groupId,
          content: group.lastMessage,
          createdAt: group.createdAt,
          groupName: group.name,
          groupImage: group.image || null,
          senderId: group.creatorId,
          senderName: group.creatorName,
          color: group.color,
          lastMessageSender: {
            type: "user",
            userId: group.creatorId,
            name: group.creatorName,
            surname: group.creatorSurname,
          },
        },
        isOwnMessage: false,
      }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch, userId]);

  // Arama
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    document.querySelectorAll(".chat-room-list li").forEach((item) => {
      item.style.display = item.textContent.toLowerCase().includes(value) ? "" : "none";
    });
  };

  // Tab değiştir
  const toggleTab = () => {
    const newTab = activeTab === CHATS_TABS.DEFAULT ? CHATS_TABS.ARCHIVE : CHATS_TABS.DEFAULT;
    dispatch(setActiveTab(newTab));
  };

  const showArchivedToggle = archivedContacts.length > 0;

  return (
    <>
      <div className="position-relative">
        <div className="px-3 pt-4 d-flex justify-content-between align-items-start">
          <h4 className="mb-4">
            {activeTab === CHATS_TABS.DEFAULT ? "Sohbetler" : "Arşivlenmiş Sohbetler"}
          </h4>

          <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
            <DropdownToggle color="none" className="btn nav-btn text-black pe-0">
              <i className="bx bx-dots-vertical-rounded" />
            </DropdownToggle>
             <DropdownMenu container="body">
              <DropdownItem onClick={() => setIsGroupModalOpen(true)}>
                Grup Oluştur <i className="bx bx-group text-muted ms-2" />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <Form className="px-3 mb-3 ">
          <div className="input-group">
            <Input
              type="text"
              className="form-control bg-light border-0 pe-0"
              placeholder="Arama yap..."
              onChange={handleSearch}
            />
            <Button color="light" type="button">
              <i className="bx bx-search align-middle" />
            </Button>
          </div>
        </Form>

        {showArchivedToggle && (
          <div className="px-3 mb-3">
            <Link onClick={toggleTab} className="text-decoration-none shadow-lg">
              <span className="bg-primary text-white d-inline-flex align-items-center px-3 py-2 rounded-pill shadow-sm">
                <span className="me-2" style={{ fontSize: 12 }}>
                  {activeTab === CHATS_TABS.ARCHIVE ? "Sohbetler" : "Arşivlenmiş"}
                </span>
                <i
                  style={{ fontSize: 14 }}
                  className={`bx ${activeTab === CHATS_TABS.ARCHIVE ? "bx-archive-out" : "bx-archive-in"}`}
                />
              </span>
            </Link>
          </div>
        )}

        <AppSimpleBar className="chat-room-list overflow-x-hidden">
          {activeTab === CHATS_TABS.DEFAULT ? (
            <Favourites users={contacts} setSelectedUser={setSelectedUser} userId={userId} activeTab={activeTab}/>
          ) : archivedContacts.length === 0 ? (
            <p className="text-center text-muted">
              Arşivlenmiş sohbet bulunmamaktadır. <br />
              <Link onClick={toggleTab} className="text-primary">Sohbetlere dön</Link>
            </p>
          ) : (
            <Favourites users={archivedContacts} setSelectedUser={setSelectedUser} userId={userId} activeTab={activeTab} />
          )}
        </AppSimpleBar>
      </div>

      <GroupCreateModal isOpen={isGroupModalOpen} toggle={() => setIsGroupModalOpen(false)} />
    </>
  );
};

export default memo(Index);