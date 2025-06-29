import React, { memo, useEffect } from "react";
import { Nav } from "reactstrap";
import LightDarkMode from "../../components/LightDarkMode";
import { toggleLayoutMode } from "../../redux/slices/layoutSlice";

import { MENU_ITEMS } from "./menu";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTab } from "../../redux/slices/tabSlice";
import { Logo } from "./Logo";
import MenuNavItem from "./MenuNavItem";
import ProfileDropdownMenu from "./ProfileDropdownMenu";
import { useViewport } from "../../hooks/WindowHooks"; // Yolunu kendine göre ayarla

const SideMenu = () => {
  const menuItems = MENU_ITEMS;
  const layoutMode = useSelector((state) => state.layout.layoutMode);
  const selectedTab = useSelector((state) => state.tab.selectedTab);
  const dispatch = useDispatch();
  const { width } = useViewport();

  const isMobile = width <= 768;

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

          {/* Masaüstünde LightDarkMode burada */}
          {!isMobile && (
            <LightDarkMode layoutMode={layoutMode} onChangeLayoutMode={onChangeLayoutMode} />
          )}

          <ProfileDropdownMenu
            onChangeTab={onChangeTab}
            isMobile={isMobile} // mobil bilgisini ProfileDropdownMenu'ya gönderiyoruz
            layoutMode={layoutMode}
            onChangeLayoutMode={onChangeLayoutMode}
          />
        </Nav>
      </div>
    </div>
  );
};

export default memo(SideMenu);
