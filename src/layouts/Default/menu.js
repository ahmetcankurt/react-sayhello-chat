import { TABS } from "../../constants/index";
import COLORS from "../../constants/menuColors";

const MENU_ITEMS = [
  {
    id: 1,
    key: "pills-user-tab",
    icon: "bx bx-user-circle",
    tooltipTitle: "Profil",
    className: "d-none d-lg-block",
    tabId: TABS.USERS,
    color: COLORS.profile,
  },
  {
    id: 2,
    key: "pills-chat-tab",
    icon: "bx bx-conversation",
    tooltipTitle: "Sohbetler",
    tabId: TABS.CHAT,
    color: COLORS.chat,
  },
  {
    id: 3,
    key: "pills-contacts-tab",
    icon: "bx bxs-user-detail",
    tooltipTitle: "Kişiler",
    tabId: TABS.CONTACTS,
    color: COLORS.contacts,
  },
  {
    id: 4,
    key: "pills-friend-request",
    icon: "bx bx-user-plus",
    tooltipTitle: "Arkadaşlık İstekleri",
    tabId: TABS.FriendRequest,
    color: COLORS.friendRequest,
  },
  {
    id: 6,
    key: "pills-setting-tab",
    icon: "bx bx-cog",
    tooltipTitle: "Ayarlar",
    tabId: TABS.SETTINGS,
    color: COLORS.settings,
  },
];

export { MENU_ITEMS };
