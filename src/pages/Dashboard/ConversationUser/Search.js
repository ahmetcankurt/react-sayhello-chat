import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Input,
} from "reactstrap";

export const Search = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle
        color="none"
        className="btn nav-btn dropdown-toggle"
        type="button"
      >
        <i className="bx bx-search"></i>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg">
        <div className="search-box p-2">
          <Input type="text" className="form-control" placeholder="Search.." />
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};