import { memo, useEffect } from "react";
import { Button, Form, Input } from "reactstrap";
import AppSimpleBar from "../../../components/AppSimpleBar";
import Favourites from "./Favourites";

import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../../redux/slices/messagesSlice";

const Index = ({setSelectedUser}) => {
  const dispatch = useDispatch();
  const { contacts, status } = useSelector((state) => state.messages);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMessages());
    }
  }, [dispatch, status]);

  // Arama fonksiyonu
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

  return (
    <>
      <div>
        <div className="px-3 pt-4">
          <div className="d-flex align-items-start">
            <div className="flex-grow-1">
              <h4 className="mb-4">Sohbetler</h4>
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

export default memo(Index)
