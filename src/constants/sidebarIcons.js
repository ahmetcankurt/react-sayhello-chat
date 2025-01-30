import {
    BsPersonCircle,
    BsFillPersonPlusFill,
} from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { MdOutlineChat, MdOutlinePeopleAlt } from "react-icons/md";

 const ICON_DATA = [
    { icon: BsPersonCircle, tooltip: "Profile", name: "profile" },
    { icon: MdOutlineChat, tooltip: "Messages", name: "messages" },
    { icon: MdOutlinePeopleAlt, tooltip: "Friends", name: "friends" },
    { icon: BsFillPersonPlusFill, tooltip: "Requests", name: "requests" },
    { icon: FiSettings, tooltip: "Settings", name: "settings" },
];

export default ICON_DATA