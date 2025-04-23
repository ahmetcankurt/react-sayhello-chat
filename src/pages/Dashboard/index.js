import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import classnames from "classnames";

import Leftbar from "./Leftbar";
import ConversationUser from "./ConversationUser/index";
import UserProfileDetails from "./UserProfileDetails/index";
import Welcome from "./ConversationUser/Welcome";
import { TABS } from "../../constants";
import { fetchUserData } from "../../redux/slices/selectedUser";
import Notifications from "../../components/Notification";

const Index = () => {
  const [selectedTab, setSelectedTab] = useState(TABS.CHAT);
  const [state, setState] = useState({
    isProfileVisible: false,
    selectedUser: null,
  });
  const { isProfileVisible, selectedUser } = state;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData(selectedUser));
  }, [selectedUser, dispatch]);

  const toggleVisibility = (key) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
            <div className="w-100 overflow-hidden  position-relative">
              <ConversationUser
                selectedUser={selectedUser}
                isProfileVisible={isProfileVisible}
                setSelectedUser={(user) =>
                  setState((prev) => ({ ...prev, selectedUser: user }))
                }
                handleProfileClick={() => toggleVisibility("isProfileVisible")}
                toggleContentVisibility={() =>
                  setState((prev) => ({ ...prev, selectedUser: null }))
                }
              />
            </div>
            <UserProfileDetails
              selectedUser={selectedUser}
              isProfileVisible={isProfileVisible}
              handleProfileClick={() => toggleVisibility("isProfileVisible")}
            />
          </div>
        ) : (
          <Welcome />
        )}
      </div>
    </>
  );
};

export default memo(Index);