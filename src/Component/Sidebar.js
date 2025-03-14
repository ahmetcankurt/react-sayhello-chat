import { useNavigate } from "react-router-dom";
import { CgMenuLeft } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
import CustomTooltip from "./Tooltip";
import ICON_DATA from "../constants/sidebarIcons";
import MeImage from "../assets/image/login-bg-1.webp";
import { memo } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../config";
import "./Sidebar.css";

const Sidebar = ({ onLinkClick, activePage, toggleContentVisibility }) => {
  const userInfo = useSelector((state) => state.userInformation.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-hamburger-icon">
        <CustomTooltip content="Chat App" position="right">
          <CgMenuLeft onClick={toggleContentVisibility} className="sidebar-icon" />
        </CustomTooltip>
      </div>

      <div className="sidebar-icon-group">
        {ICON_DATA.map(({ icon: Icon, name }) => (
          <div
            key={name}
            className={`sidebar-icon ${activePage === name ? "active" : ""}`}
            onClick={() => onLinkClick(name)}
          >
            <Icon />
          </div>
        ))}
      </div>

      <div className="dropdown">
        <img
          src={userInfo?.profileImage ? `${API_URL}/${userInfo?.profileImage}` : MeImage}
          className="sidebar-bottom-image "
          alt="me-image"
          style={{ cursor: "pointer" }}
          data-bs-toggle="dropdown"
        />

        <ul className="dropdown-menu mb-2 ms-1" style={{zIndex : 1002}}>
          <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
            <RiLogoutCircleLine className="me-2" /> Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default memo(Sidebar);