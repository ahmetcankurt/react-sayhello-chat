import { useState } from "react";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { BsPersonCircle } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { MdOutlineChat } from "react-icons/md";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Chat from "./ChatBox/Chat";
import Requests from "./Requests"
import Profile from "./Profile";
import Mymessages from "./Messages";
import FriendsList from "./Friends"
import ProfileSettings from "./ProfileSettings"

import CustomTooltip from "./Tooltip";
import MeImage from "../assest/image/login-bg-1.webp";

import "./Home.css";

const iconData = [
  { icon: <BsPersonCircle />, tooltip: "Profile", name: "profile" },
  { icon: <MdOutlineChat />, tooltip: "Messages", name: "messages" },
  { icon: <MdOutlinePeopleAlt />, tooltip: "Friends", name: "friends" },
  { icon: <BsFillPersonPlusFill />, tooltip: "Requests", name: "requests" },
  { icon: <FiSettings />, tooltip: "Settings", name: "settings" },
];

const Sidebar = ({ onLinkClick }) => {
  return (
    <div className="sidebar">
      <div>
        <CustomTooltip
          content="Say Hello"
          position="right"
          color="#fff"
          backgroundColor="#000"
          height="auto"
          borderRadius="8px"
        >
          <BsFillChatSquareTextFill className="sayy-hello-icon" />
        </CustomTooltip>
      </div>
      <div className="sidebar-icon-group">
        {iconData.map((item, index) => (
          <CustomTooltip
            key={index}
            content={item.tooltip}
            position="right"
            color="#fff"
            backgroundColor="#000"
            height="auto"
            borderRadius="8px"
            padding
          >
            <div
              className="sidebar-icon"
              onClick={() => onLinkClick(item.name)}
            >
              {item.icon}
            </div>
          </CustomTooltip>
        ))}
      </div>
      <div className="sidebar-bottom">
        <img src={MeImage} className="sidebar-bottom-image" />
      </div>
    </div>
  );
};

const App = () => {
  const [activePage, setActivePage] = useState("profile");

  const handleLinkClick = (page) => {
    setActivePage(page);
  };

  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="app-container">
      <Sidebar onLinkClick={handleLinkClick} />
      <div className="content">
        {activePage === "profile" && <Profile />}
        {activePage === "messages" && <Mymessages setSelectedUser={setSelectedUser} selectedUser={selectedUser} />}
        {activePage === "friends" && <FriendsList setSelectedUser={setSelectedUser} selectedUser={selectedUser} />}
        {activePage === "settings" && <ProfileSettings />}
        {activePage === "requests" && <Requests />}

      </div>
      <div className="message-box">
        {selectedUser ? (
          <Chat selectedUser={selectedUser} />
        ) : (
          <div className="not-chat">Mesajlaşmak için mesajlarınızı seçin. </div>
        )}
      </div>

    </div>
  );
};

export default App;
