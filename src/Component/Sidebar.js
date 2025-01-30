import { useNavigate } from "react-router-dom";
import { CgMenuLeft } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
import useMobileMode from "../hooks/useMobileMode";
import CustomTooltip from "./Tooltip";
import ICON_DATA from "../constants/sidebarIcons";
import MeImage from "../assest/image/login-bg-1.webp";
import { memo } from "react";

const Sidebar = ({ onLinkClick, activePage, toggleContentVisibility }) => {
  const isMobile = useMobileMode();
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
        {ICON_DATA.map(({ icon: Icon, tooltip, name }) => (
          <CustomTooltip
            key={name}
            content={tooltip}
            // position={isMobile ? "top" : "right"}
            position="right"
          >
            <div
              className={`sidebar-icon ${activePage === name ? "active" : ""}`}
              onClick={() => {
                onLinkClick(name);
              }}
            >
              <Icon />
            </div>
          </CustomTooltip>
        ))}
        <img src={MeImage} className="sidebar-bottom-mobil-none" alt="me-image" />
      </div>
      <div className="dropdown">
        <img
          src={MeImage}
          className="sidebar-bottom-image"
          alt="me-image"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          style={{ cursor: "pointer" }}
        />
        <ul className="dropdown-menu " >
          <li className="dropdown-item d-flex" style={{ justifyContent: "space-between", alignItems: "center" }} onClick={handleLogout}>
            <span>Log Out</span>
            <RiLogoutCircleLine />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default memo(Sidebar)