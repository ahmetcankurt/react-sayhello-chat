import { memo, useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Input } from "reactstrap";
import AppSimpleBar from "../../../components/AppSimpleBar";
import Favourites from "./Favourites";

import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, updateContactList } from "../../../redux/slices/messagesSlice";
import { io } from "socket.io-client";
import { API_URL } from "../../../config";


const Index = ({ setSelectedUser }) => {
  const dispatch = useDispatch();
  const { contacts, status } = useSelector((state) => state.messages);
  const socketRef = useRef(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMessages());
    }
  }, [dispatch, status]);


  useEffect(() => {
    const userId = localStorage.getItem("userId");
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
  
    return () => {
      socketRef.current?.off("newMessage");
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

  return (
    <>
      <div>
        <div className="px-3 pt-4">
          <div className="d-flex align-items-start">
            <div className="flex-grow-1">
              <h4 className="mb-4">Sohbetler</h4>
            </div>
            <div className="flex-shrink-0" style={{ position: "relative" }}>
              
              <Dropdown isOpen={dropdownOpen} toggle={toggle} style={{ zIndex : 10 }}>
                <DropdownToggle
                  color="none"
                  className="btn nav-btn text-black "
                  type="button"
                >
                  <i className="bx bx-dots-vertical-rounded"></i>
                </DropdownToggle>
                <DropdownMenu >
                  <DropdownItem
                    className="d-flex justify-content-between align-items-center  user-profile-show"
                    to="#"
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

        <AppSimpleBar className="chat-room-list">
          <Favourites users={contacts} setSelectedUser={setSelectedUser} />
        </AppSimpleBar>
      </div>
    </>
  );
};

export default memo(Index);