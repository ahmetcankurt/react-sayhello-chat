import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // useSelector eklendi
import classnames from "classnames";

import Leftbar from "./Leftbar";
import ConversationUser from "./ConversationUser/index";
import UserProfileDetails from "./UserProfileDetails/index";
import Welcome from "./ConversationUser/Welcome";
import { TABS } from "../../constants";
import { fetchUserData } from "../../redux/slices/selectedUser";
import Notifications from "../../components/Notification";
import { motion } from "framer-motion";
import { themeImages } from "../../constants/themeImages"
import { getUsers } from "../../redux/slices/userInformation";
import { fetchFriends } from "../../redux/slices/friendRequestsSlice";

const Index = () => {
  const userId = localStorage.getItem("userId")
  const [selectedTab, setSelectedTab] = useState(TABS.USERS);
  const [state, setState] = useState({
    isProfileVisible: false,
    selectedUser: null,
  });
  const { isProfileVisible, selectedUser } = state;
  const { status } = useSelector((state) => state.friendRequests);


  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tab.selectedTab); // Aktif tab bilgisini al

  useEffect(() => {
    if (selectedUser?.id && selectedUser?.userType) {
      dispatch(fetchUserData({ id: selectedUser.id, userType: selectedUser.userType }));
    }
  }, [selectedUser, dispatch]);


  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Başlangıçta ve state değiştiğinde arkadaşları çek
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFriends(userId));
    }
  }, [dispatch, status, userId]);



  const toggleVisibility = (key) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const savedId = localStorage.getItem("selectedThemeImage") || themeImages[0].id;
    const found = themeImages.find(img => img.id === savedId);
    const userChat = document.getElementById("user-chat");
    if (userChat && found) {
      themeImages.forEach(i => userChat.classList.remove(i.pattern));
      userChat.classList.add(found.pattern);
    }
  }, []);
  const [replyData, setReplyData] = useState(null);
  return (
    <>
      <Notifications selectedUser={selectedUser} />

      <Leftbar
        activeTab={selectedTab}
        setSelectedTab={setSelectedTab}
        setSelectedUser={(user) =>
          setState((prev) => ({ ...prev, selectedUser: user }))
        }
      />

      <div
        className={classnames("user-chat", "w-100", "overflow-hidden", {
          "user-chat-show": selectedUser,
        })}
        id="user-chat"
      >
        <div className="user-chat-overlay" id="user-chat-overlay"></div>
        {selectedUser !== null ? (
          <div className="chat-content d-lg-flex">
            <motion.div
              className="w-100 overflow-hidden position-relative"
              key={selectedUser?.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <ConversationUser
                selectedUser={selectedUser}
                isProfileVisible={isProfileVisible}
                setReplyData={setReplyData}
                replyData={replyData}
                setSelectedUser={(user) =>
                  setState((prev) => ({ ...prev, selectedUser: user }))
                }
                handleProfileClick={() => toggleVisibility("isProfileVisible")}
                toggleContentVisibility={() =>
                  setState((prev) => ({ ...prev, selectedUser: null }))
                }
              />
            </motion.div>

            <UserProfileDetails
              selectedUser={selectedUser}
              isProfileVisible={isProfileVisible}
              handleProfileClick={() => toggleVisibility("isProfileVisible")}
            />
          </div>
        ) : (
          <Welcome activeTab={activeTab} />
        )}
      </div>
    </>
  );
};

export default memo(Index);