import { TabContent, TabPane } from "reactstrap";
import { TABS } from "../../constants/index";
import { useDispatch, useSelector } from "react-redux";
import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import Profile from "./Profile";
import Chats from "./Chats";
import Contacts from "./Contacts";
import Settings from "./Settings";
import FriendRequest from "./FriendRequest";
import Notifications from "./Notifications"; // Assuming Notifications uses the same component as Settings
import { io } from "socket.io-client";
import { API_URL } from "../../config";
import { updateContactList } from "../../redux/slices/messagesSlice";

const COMPONENTS = {
  [TABS.USERS]: Profile,
  [TABS.CHAT]: Chats,
  [TABS.CONTACTS]: Contacts,
  [TABS.SETTINGS]: Settings,
  [TABS.FriendRequest]: FriendRequest,
  [TABS.NOTIFICATIONS]:  Notifications, // Assuming Notifications uses the same component as Settings
};

const Leftbar = ({ setSelectedUser }) => {
  const activeTab = useSelector((state) => state.tab.selectedTab);
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      socketRef.current = io(API_URL, {
        transports: ["websocket"],
        auth: { token: localStorage.getItem("token") },
      });

      socketRef.current.emit("joinRoom", String(userId));
    }

    socketRef.current.on("newMessage", (newMessage) => {
      const isOwnMessage = newMessage.senderId === parseInt(userId);
      dispatch(updateContactList({ message: newMessage, isOwnMessage }));
    });

    socketRef.current.on("newGroupCreated", (groupData) => {
      console.log("New group created:", groupData);
      dispatch(
        updateContactList({
          message: {
            groupId: groupData.groupId,
            content: groupData.lastMessage,
            createdAt: groupData.createdAt,
            groupName: groupData.name,
            profileImage: groupData.profileImage || null, // Use group image if available
            senderId: groupData.creatorId,
            senderName: groupData.creatorName,
            senderSurname: groupData.creatorSurname,
            color: groupData.color,
            lastMessageSender: {
              type: "user",
              userId: groupData.creatorId,
              name: groupData.creatorName,
              surname: groupData.creatorSurname,
            },
          },
          isOwnMessage: false,
        })
      );
    });

    return () => {
      socketRef.current?.off("newMessage");
      socketRef.current?.off("newGroupCreated");
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [dispatch, userId]);

  return (
    <div className="chat-leftsidebar" >
      <TabContent activeTab={activeTab}>
        {Object.entries(COMPONENTS).map(([tabId, Component]) => (
          <TabPane key={tabId} tabId={tabId} role="tabpanel">
            {activeTab === tabId && (
              <motion.div
                key={activeTab}
                initial={{ clipPath: "circle(0% at 0% 50%)", opacity: 0 }}
                animate={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
              >
                <Component
                  {...(tabId === TABS.CHAT || tabId === TABS.CONTACTS
                    ? { setSelectedUser }
                    : {})}
                />
              </motion.div>
            )}
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
};

export default memo(Leftbar);
