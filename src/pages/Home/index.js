import { useEffect, useState } from "react";
import { BsChatText } from "react-icons/bs";
import FriendsProfile from "../FriendsProfile";
import Chat from "../ChatBox/Chat";
import Requests from "../Requests";
import Profile from "../Profile";
import Mymessages from "../Messages";
import FriendsList from "../Friends";
import ProfileSettings from "../ProfileSettings";
import NotChat from "./NotChat";

import Notifications from "../../Component/Notification";
import Sidebar from "../../Component/Sidebar";

import "./Home.css";

const App = () => {
  const [state, setState] = useState({
    activePage: "profile",
    isContentVisible: true,
    isProfileVisible: false,
    selectedUser: null,
  });

  const { activePage, isContentVisible, isProfileVisible, selectedUser } = state;

  const toggleVisibility = (key) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePageChange = (page) => {
    setState((prev) => ({
      ...prev,
      activePage: page,
      isContentVisible: true, // Reset visibility when page changes
    }));
  };

  const renderContent = {
    profile: <Profile />,
    messages: (
      <Mymessages
        setSelectedUser={(user) =>
          setState((prev) => ({ ...prev, selectedUser: user }))
        }
        selectedUser={selectedUser}
      />
    ),
    friends: (
      <FriendsList
        setSelectedUser={(user) =>
          setState((prev) => ({ ...prev, selectedUser: user }))
        }
        selectedUser={selectedUser}
      />
    ),
    settings: <ProfileSettings />,
    requests: <Requests />,
  }[activePage] || null;

  return (
    <div className="d-flex">
      <Notifications selectedUser={selectedUser} />
      <Sidebar
        onLinkClick={handlePageChange}
        activePage={activePage}
        toggleContentVisibility={() => toggleVisibility("isContentVisible")}
      />
      <div className={`content ${isContentVisible ? "visible" : "hidden"}`}>
        {renderContent}
      </div>
      <div className="message-box">
        {selectedUser ? (
          <Chat
            selectedUser={selectedUser}
            handleProfileClick={() => toggleVisibility("isProfileVisible")}
          />
        ) : (
          <NotChat />
        )}
      </div>
      {isProfileVisible && <FriendsProfile selectedUser={selectedUser} />}
    </div>
  );
};

export default App;