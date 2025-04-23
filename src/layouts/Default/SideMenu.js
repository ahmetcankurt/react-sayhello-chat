import React, { memo, useEffect, useState } from "react";
import classnames from "classnames";

import {
  Nav,
  NavItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  NavLink,
  UncontrolledTooltip,
} from "reactstrap";
import { TABS } from "../../constants/index";
import LightDarkMode from "../../components/LightDarkMode";
import { toggleLayoutMode } from "../../redux/slices/layoutSlice";

// menu
import { MENU_ITEMS } from "./menu";
import { useDispatch, useSelector } from "react-redux";

import { setSelectedTab } from "../../redux/slices/tabSlice";

import { Logo } from "./Logo";
import { API_URL } from "../../config";

const MenuNavItem = ({ item, selectedTab, onChangeTab }) => {
  const onClick = () => {
    onChangeTab(item.tabId);
  };
  return (
    <>
      <NavItem className={item.className} id={`${item.key}-container`}>
        <NavLink
          href="#"
          active={selectedTab === item.tabId}
          id={item.key}
          role="tab"
          onClick={onClick}
        >
          <i className={item.icon}></i>
        </NavLink>
      </NavItem>
      <UncontrolledTooltip
        target={`${item.key}-container`}
        placement="right"
        timeout={{ enter: 150, exit: 100 }}
      >
        {item.tooltipTitle}
      </UncontrolledTooltip>
    </>
  );
};


const ProfileDropdownMenu = ({ onChangeTab }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const userInfo = useSelector((state) => state.userInformation.user);
  const shortName = userInfo
  ? `${userInfo?.name?.charAt(0).toUpperCase() || ''}${userInfo?.surname?.charAt(0).toUpperCase() || ''}`
  : '';


  const colors = [
    "bg-primary",
    "bg-danger",
    "bg-info",
    "bg-warning",
    "bg-secondary",
    "bg-pink",
    "bg-purple",
  ];
  const [color] = useState(Math.floor(Math.random() * colors.length));

  const handleImageError = () => {
    setImageError(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    window.location.href = "/logout";
  };

  return (
    <Dropdown
      nav
      isOpen={dropdownOpen}
      className="profile-user-dropdown "
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
      toggle={toggle}
    >
      <DropdownToggle nav className="bg-transparent">
        {userInfo?.profileImage && !imageError ? (
          <img
            src={`${API_URL}/${userInfo.profileImage}`}
            alt={userInfo.name ? `${userInfo.name} ${userInfo.surname}` : 'Profile'}
            className="profile-user rounded-circle"
            onError={handleImageError}
          />
        ) : (
          <span className={`p-2 rounded-circle ${colors[color]} text-white font-size-22`}>
            {shortName}
          </span>
        )}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          onClick={() => onChangeTab(TABS.USERS)}
        >
          Profil
          <i className="bx bx-user-circle text-muted ms-1"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          onClick={() => onChangeTab(TABS.SETTINGS)}
        >
          Ayarlar
          <i className="bx bx-cog text-muted ms-1"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          href="/auth-changepassword"
        >
          Şifre Değiştir
          <i className="bx bx-lock-open text-muted ms-1"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          onClick={handleLogout}
        >
          Çıkış Yap
          <i className="bx bx-log-out-circle text-muted ms-1"></i>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};


const SideMenu = () => {
  const menuItems = MENU_ITEMS;
  const layoutMode = useSelector((state) => state.layout.layoutMode);
  const selectedTab = useSelector((state) => state.tab.selectedTab);
  const dispatch = useDispatch();

  const onChangeTab = (id) => {
    dispatch(setSelectedTab(id));
  };

  const onChangeLayoutMode = () => {
    dispatch(toggleLayoutMode());
  };

  useEffect(() => {
    if (document.body) {
      document.body.setAttribute("data-bs-theme", layoutMode);
    }
  }, [layoutMode]);

  return (
    <div className="side-menu flex-lg-column">
      <Logo />

      <div className="flex-lg-column my-0 sidemenu-navigation">
        <Nav pills className="side-menu-nav" role="tablist">
          {(menuItems || []).map((item, key) => (
            <MenuNavItem item={item} key={key} selectedTab={selectedTab} onChangeTab={onChangeTab} />
          ))}

          <LightDarkMode layoutMode={layoutMode} onChangeLayoutMode={onChangeLayoutMode} />
          <ProfileDropdownMenu onChangeTab={onChangeTab} />
        </Nav>
      </div>
    </div>
  );
};

export default memo(SideMenu);