import { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { MdOutlineChat } from "react-icons/md";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { CgMenuLeft } from "react-icons/cg";
import FriendsProfile from "./FriendsProfile"
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

const Sidebar = ({ onLinkClick, activePage, toggleContentVisibility }) => {
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
          <CgMenuLeft className="sayy-hello-icon" onClick={toggleContentVisibility} />
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
              className={`sidebar-icon ${activePage === item.name ? 'active' : ''}`}
              onClick={() => onLinkClick(item.name)}
            >
              {item.icon}
            </div>
          </CustomTooltip>
        ))}
      </div>
      <div className="sidebar-bottom">
        <img src={MeImage} className="sidebar-bottom-image" alt="me-image" />
      </div>
    </div>
  );
};

const App = () => {
  const [activePage, setActivePage] = useState("profile");
  const [isContentVisible, setIsContentVisible] = useState(true); // Yeni state
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const handleLinkClick = (page) => {
    setActivePage(page);
  };

  const [selectedUser, setSelectedUser] = useState(null);


  const toggleContentVisibility = () => {
    setIsContentVisible((prev) => !prev); // İçeriğin görünürlüğünü değiştir
  };

  useEffect(() => {
    setIsContentVisible(true);
  }, [activePage]);

  const handleProfileClick = () => {
    setIsProfileVisible((prev) => !prev); // Profil görünürlüğünü değiştir
  };

  return (
    <div className="app-container">
      <Sidebar onLinkClick={handleLinkClick} activePage={activePage} toggleContentVisibility={toggleContentVisibility} />
      <div className={`content ${isContentVisible ? 'visible' : 'hidden'}`}>
        {activePage === "profile" && <Profile />}
        {activePage === "messages" && <Mymessages setSelectedUser={setSelectedUser} selectedUser={selectedUser} />}
        {activePage === "friends" && <FriendsList setSelectedUser={setSelectedUser} selectedUser={selectedUser} />}
        {activePage === "settings" && <ProfileSettings />}
        {activePage === "requests" && <Requests />}
      </div>
      <div className="message-box">
        {selectedUser ? (
          <Chat selectedUser={selectedUser} handleProfileClick={handleProfileClick} />
        ) : (
          <div className="not-chat">Mesajlaşmak için mesajlarınızı seçin. </div>
        )}
      </div>
      {isProfileVisible && 
        <FriendsProfile  selectedUser={selectedUser}/>
      }
    </div>
  );
};

export default App;