import { TabContent, TabPane } from "reactstrap";
import { TABS } from "../../constants/index";
import { useSelector } from "react-redux";
import { memo, useEffect } from "react";
import { motion } from "framer-motion";

import Profile from "./Profile";
import Chats from "./Chats";
import Contacts from "./Contacts";
import Settings from "./Settings";
import FriendRequest from "./FriendRequest";

const COMPONENTS = {
  [TABS.USERS]: Profile,
  [TABS.CHAT]: Chats,
  [TABS.CONTACTS]: Contacts,
  [TABS.SETTINGS]: Settings,
  [TABS.FriendRequest]: FriendRequest,
};

const Leftbar = ({ setSelectedUser }) => {
  const activeTab = useSelector((state) => state.tab.selectedTab);

  return (
    <div className="chat-leftsidebar" style={{
    }}
    >
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
