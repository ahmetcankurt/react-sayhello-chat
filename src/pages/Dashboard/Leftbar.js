import { TabContent, TabPane } from "reactstrap";

import { TABS } from "../../constants/index";

// component
import Profile from "./Profile/index";
import Chats from "./Chats/index";
import Contacts from "./Contacts/index";
import Calls from "./Calls/index";
import Bookmark from "./Bookmark/index";
import Settings from "./Settings/index";
import Notification from "./Notifications/index";
import { useSelector } from "react-redux";
import { memo } from "react";

const Leftbar = ({ setSelectedUser }) => {
  const activeTab = useSelector((state) => state.tab.selectedTab);
  return (
    <>
      <div className="chat-leftsidebar">
        <TabContent activeTab={activeTab}>
          <TabPane tabId={TABS.USERS} role="tabpanel">
            <Profile />
          </TabPane>

          <TabPane tabId={TABS.CHAT} role="tabpanel">
            <Chats setSelectedUser={setSelectedUser} />
          </TabPane>

          <TabPane tabId={TABS.CONTACTS} role="tabpanel">
            <Contacts setSelectedUser={setSelectedUser} />
          </TabPane>
          <TabPane tabId={TABS.SETTINGS} role="tabpanel">
            <Settings />
          </TabPane>
          <TabPane  tabId={TABS.Notification} role="tabpanel">
            <Notification />
          </TabPane>
        </TabContent>
      </div>
    </>
  );
};

export default memo(Leftbar);
