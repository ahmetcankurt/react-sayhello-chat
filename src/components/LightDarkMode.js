import React, { memo } from "react";
import { NavItem, UncontrolledTooltip, NavLink } from "reactstrap";

// Sabitler
import { LAYOUT_MODES } from "../constants/index";

const LightDarkMode = ({ layoutMode, onChangeLayoutMode }) => {
  const mode =
    layoutMode === LAYOUT_MODES["DARK"]
      ? LAYOUT_MODES["LIGHT"]
      : LAYOUT_MODES["DARK"];
  return (
    <NavItem className="mt-auto" id="color-mode" style={{ cursor: "pointer" }}>
      <NavLink
        className="nav-link light-dark"
        onClick={() => onChangeLayoutMode(mode)}
      >
        <i className="bx bx-moon" id="moon"></i>
      </NavLink>
      <UncontrolledTooltip placement="right" target="color-mode">
        <span className="light-mode">Aydınlık</span>
        <span className="dark-mode">Karanlık</span> mod
      </UncontrolledTooltip>
    </NavItem>
  );
};

export default memo(LightDarkMode);
