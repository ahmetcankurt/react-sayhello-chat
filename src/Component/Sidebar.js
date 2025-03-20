import { useNavigate } from "react-router-dom";
import { CgMenuLeft } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
import CustomTooltip from "./Tooltip";
import ICON_DATA from "../constants/sidebarIcons";
import ProfileBg from "../assets/image/image_header.jpg";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../config";
import "./Sidebar.css";

const Sidebar = ({ onLinkClick, activePage, toggleContentVisibility }) => {
  const userInfo = useSelector((state) => state.userInformation.user);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false); // Track image error

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-icon sidebar-hamburger-icon">
        <CgMenuLeft onClick={toggleContentVisibility} />
      </div>
      <div className="sidebar-nav">
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
                src={imageError || !userInfo?.profileImage ? ProfileBg : `${API_URL}/${userInfo?.profileImage}`}
                className="sidebar-bottom-image"
                alt="me-image"
                style={{ cursor: "pointer" }}
                data-bs-toggle="dropdown"
                onError={() => setImageError(true)} // Handle image error
            />
            <ul className="dropdown-menu mb-2 ms-1" style={{ zIndex: 1002 }}>
                <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                    <RiLogoutCircleLine className="me-2" /> Logout
                </button>
            </ul>
        </div>
      </div>
    </aside>
  );
};

export default memo(Sidebar);