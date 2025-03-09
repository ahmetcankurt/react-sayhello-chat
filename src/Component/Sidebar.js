import { useNavigate } from "react-router-dom";
import { CgMenuLeft } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
import CustomTooltip from "./Tooltip";
import ICON_DATA from "../constants/sidebarIcons";
import MeImage from "../assets/image/login-bg-1.webp";
import { memo } from "react";
import { useSelector } from "react-redux";
import useMobileMode from "../hooks/useMobileMode"
import { API_URL } from "../config"
import "./Sidebar.css"

const Sidebar = ({ onLinkClick, activePage, toggleContentVisibility }) => {
  const userInfo = useSelector((state) => state.userInformation.user);
  const navigate = useNavigate();

  const useMobile = useMobileMode()

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!userInfo) {
    return
  }

  return (
    <div className="sidebar ">
      <div className="sidebar-hamburger-icon">
        <CustomTooltip content="Chat App" position="right">
          <CgMenuLeft onClick={toggleContentVisibility} className="sidebar-icon" />
        </CustomTooltip>
      </div>
      <div className="sidebar-icon-group ">
        {ICON_DATA.map(({ icon: Icon, tooltip, name }) => (
          // <CustomTooltip
          //   content={tooltip}
          //   position={useMobile ? "top" : "right"}
          // >
            <div
              key={name}
              className={`sidebar-icon ${activePage === name ? "active" : ""}`}
              onClick={() => {
                onLinkClick(name);
              }}
            >
              <Icon />
            </div>
          // </CustomTooltip>
        ))}
      </div>
      <div className="sidebar-bottom-div">
        <img
          src={`${API_URL}/${userInfo.profileImage}` || MeImage}
          className="sidebar-bottom-image"
          alt="me-image"
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default memo(Sidebar)