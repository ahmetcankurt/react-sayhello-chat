import React, {  memo, useState } from "react";
import classnames from "classnames";    

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {API_URL} from "../../../config";

const ContactItem = ({ contact ,setSelectedUser}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    const toggle = () => setDropdownOpen(!dropdownOpen);
  
    const fullName = `${contact.firstName} ${contact.lastName}`;
    const shortName = `${contact.firstName.charAt(0)}${contact.lastName.charAt(
      0
    )}`;
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
  
    return (
      <li  className="contact-list-item"  onClick={() => setSelectedUser(contact.id)}>
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0 me-2">
            <div className="avatar-sm">
              {contact.profileImage ? (
                <img
                  src={`${API_URL}/${contact.profileImage}`}
                  alt="avatar"
                  className="img-fluid rounded-circle"
                />
              ) : (
                <span
                  className={classnames(
                    "avatar-title",
                    "rounded-circle",
                    "font-size-10",
                    "text-uppercase",
                    colors[color]
                  )}
                >
                  {shortName}
                </span>
              )}
            </div>
          </div>
          <div className="flex-grow-1">
            <h5 className="font-size-14 m-0">{fullName}</h5>
          </div>
          <div className="flex-shrink-0">
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle tag="a" className="text-mute">
                <i className="bx bx-dots-vertical-rounded align-middle"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  className="d-flex align-items-center justify-content-between"
                  href="#"
                >
                  Edit <i className="bx bx-pencil ms-2 text-muted"></i>
                </DropdownItem>
                <DropdownItem
                  className="d-flex align-items-center justify-content-between"
                  href="#"
                >
                  Block <i className="bx bx-block ms-2 text-muted"></i>
                </DropdownItem>
                <DropdownItem
                  className="d-flex align-items-center justify-content-between"
                  href="#"
                >
                  Remove <i className="bx bx-trash ms-2 text-muted"></i>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </li>
    );
  };

  export default memo(ContactItem);