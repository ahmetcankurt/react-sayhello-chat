import React, { memo } from "react";
import {
  NavItem,
  NavLink,
  UncontrolledTooltip,
} from "reactstrap";
import { useViewport } from "../../hooks/WindowHooks"; // hook'un yolunu kendi projenize göre ayarlayın

const MenuNavItem = ({ item, selectedTab, onChangeTab }) => {
  const { width } = useViewport();
  const isMobile = width <= 768; // mobil için breakpoint

  const onClick = () => {
    onChangeTab(item.tabId);
  };

  const defaultTimeout = { enter: 150, exit: 100 };
  const tooltipTimeout = item.timeout || defaultTimeout;

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
          <i
            className={item.icon}
            style={{
              // color: selectedTab === item.tabId ? "#fff" : item.color,
              backgroundColor: selectedTab === item.tabId ? item.color : "transparent",
              borderRadius: "50%",
              boxShadow: selectedTab === item.tabId ? `0 0 3px ${item.color}` : "none",
              padding: "8px",
              transition: "all 0.6s ease",
            }}
          />
        </NavLink>
      </NavItem>

      {!isMobile && (
        <UncontrolledTooltip
          target={`${item.key}-container`}
          placement="right"
          timeout={tooltipTimeout}
          delay={tooltipTimeout}
          autohide={false}
          fade={false}
        >
          {item.tooltipTitle}
        </UncontrolledTooltip>
      )}
    </>
  );
};

export default memo(MenuNavItem);
