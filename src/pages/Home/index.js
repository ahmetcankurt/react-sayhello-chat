import { memo, useEffect, useState } from "react";
import SplashScreen from "../../Component/SplashScreen";
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
import { useDispatch } from "react-redux";
import { getUsers } from "../../redux/slices/userInformation";
import "./Home.css";
import useMobileMode from "../../hooks/useMobileMode";

const App = () => {
  const isMobile = useMobileMode();
  const [state, setState] = useState({
    activePage: "profile",
    isContentVisible: true,
    isProfileVisible: false,
    selectedUser: null,
  });
  const { activePage, isContentVisible, isProfileVisible, selectedUser } = state;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleVisibility = (key) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePageChange = (page) => {
    setState((prev) => ({
      ...prev,
      activePage: page,
      isContentVisible: true,
    }));
  };

  useEffect(() => {
    if (isMobile) {
      setState((prev) => ({
        ...prev,
        isContentVisible: !selectedUser,
      }));
    }
  }, [selectedUser, isMobile]);

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
    <>
      {/* <SplashScreen isPageLoaded={isPageLoaded} /> */}
      {isPageLoaded && (
        <div className="layout-dizayn">
          <Notifications selectedUser={selectedUser} />
          {
            (!isMobile || selectedUser === null) &&
            <Sidebar
              onLinkClick={handlePageChange}
              activePage={activePage}
              toggleContentVisibility={() => toggleVisibility("isContentVisible")}
            />
          }
          <div className={`content ${isContentVisible ? "visible" : "hidden"}`}>
            {renderContent}
          </div>
          <div className="message-box">
            {selectedUser ? (
              <Chat
                selectedUser={selectedUser}
                handleProfileClick={() => toggleVisibility("isProfileVisible")}
                setSelectedUser={(user) => setState((prev) => ({ ...prev, selectedUser: user }))}
              />
            ) : (
              <NotChat />
            )}
          </div>
          {isProfileVisible && (
            <div className="friends-profile-overlay">
              <FriendsProfile selectedUser={selectedUser} handleProfileClick={() => toggleVisibility("isProfileVisible")}/>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default memo(App);