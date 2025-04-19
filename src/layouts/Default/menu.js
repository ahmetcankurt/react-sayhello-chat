// costants
import { TABS } from "../../constants/index";

const MENU_ITEMS= [
  {
    id: 1,
    key: "pills-user-tab",
    icon: "bx bx-user-circle",
    tooltipTitle: "Profile",
    className: "d-none d-lg-block",
    tabId: TABS.USERS,
  },
  {
    id: 2,
    key: "pills-chat-tab",
    icon: "bx bx-conversation",
    tooltipTitle: "Chats",
    tabId: TABS.CHAT,
  },
  {
    id: 3,
    key: "pills-contacts-tab",
    icon: "bx bxs-user-detail",
    tooltipTitle: "Contacts",
    tabId: TABS.CONTACTS,
  },
  {
    id: 4,
    key:  "pills-notification",
    icon: "bx bx-bell",
    tooltipTitle:  "Notification",
    tabId:  TABS.Notification,
  },

  // {
  //   id: 4,
  //   key: "pills-calls-tab",
  //   icon: "bx bx-phone-call",
  //   tooltipTitle: "Calls",
  //   tabId: TABS.CALLS,
  // },
  // {
  //   id: 5,
  //   key: "pills-bookmark-tab",
  //   icon: "bx bx-bookmarks",
  //   tooltipTitle: "Bookmark",
  //   tabId: TABS.BOOKMARK,
  // },
  {
    id: 6,
    key: "pills-setting-tab",
    icon: "bx bx-cog",
    tooltipTitle: "Settings",
    tabId: TABS.SETTINGS,
  },
];

export { MENU_ITEMS };
