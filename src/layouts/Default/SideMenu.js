import React, { memo, useEffect, useState } from "react";

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
import {API_URL} from "../../config";

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
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const userInfo = useSelector((state) => state.userInformation.user);

  // Logout fonksiyonu
  const handleLogout = () => {
    // localStorage'dan token ve kullanıcı bilgilerini sil
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    // Gerekirse kullanıcıyı bir login sayfasına yönlendirebilirsiniz
    window.location.href = "/logout";  // Örnek yönlendirme
  };

  return (
    <Dropdown
      nav
      isOpen={dropdownOpen}
      className="profile-user-dropdown"
      toggle={toggle}
    >
      <DropdownToggle nav className="bg-transparent">
        <img src={`${API_URL}/${userInfo?.profileImage}`}
          alt="Profile"
          className="profile-user rounded-circle" />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          onClick={() => onChangeTab(TABS.USERS)}
        >
          Profile <i className="bx bx-user-circle text-muted ms-1"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          onClick={() => onChangeTab(TABS.SETTINGS)}
        >
          Setting <i className="bx bx-cog text-muted ms-1"></i>
        </DropdownItem>
        {/* <DropdownItem
          className="d-flex align-items-center justify-content-between"
          href="/auth-changepassword"
        >
          Change Password <i className="bx bx-lock-open text-muted ms-1"></i>
        </DropdownItem> */}

        {/* <DropdownItem /> */}
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          onClick={handleLogout} // Logout işlemine bağla
        >
          Log out <i className="bx bx-log-out-circle text-muted ms-1"></i>
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
  }, [layoutMode]); // layoutMode değiştiğinde çalışacak

  return (
    <div className="side-menu flex-lg-column">
      {/* LOGO */}
      <Logo />
      {/* end navbar-brand-box */}

      {/* Start side-menu nav */}
      <div className="flex-lg-column my-0 sidemenu-navigation">
        <Nav pills className="side-menu-nav" role="tablist">
          {(menuItems || []).map((item, key) => (
            <MenuNavItem item={item} key={key} selectedTab={selectedTab} onChangeTab={onChangeTab} />
          ))}

          {/* Theme toggle */}
          <LightDarkMode layoutMode={layoutMode} onChangeLayoutMode={onChangeLayoutMode} />
          {/* Profile dropdown */}
          <ProfileDropdownMenu onChangeTab={onChangeTab} />
        </Nav>
      </div>
      {/* end side-menu nav */}
    </div>
  );
};

export default memo(SideMenu);