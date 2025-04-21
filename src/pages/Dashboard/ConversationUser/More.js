import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

export const More = ({
  onOpenAudio,
  onOpenVideo,
  onDelete,
  isArchive,
  onToggleArchive,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="none" className="btn nav-btn" type="button">
        <i className="bx bx-dots-vertical-rounded"></i>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <DropdownItem
          className="d-flex justify-content-between align-items-center d-lg-none user-profile-show"
          to="#"
        >
          View Profile <i className="bx bx-user text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center d-lg-none"
          to="#"
          onClick={onOpenAudio}
        >
          Audio <i className="bx bxs-phone-call text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center d-lg-none"
          to="#"
          onClick={onOpenVideo}
        >
          Video <i className="bx bx-video text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
          onClick={onToggleArchive}
        >
          {isArchive ? (
            <>
              Un-Archive <i className="bx bx-archive-out text-muted"></i>
            </>
          ) : (
            <>
              Archive <i className="bx bx-archive text-muted"></i>
            </>
          )}
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
        >
          Muted <i className="bx bx-microphone-off text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
          onClick={onDelete}
        >
          Delete <i className="bx bx-trash text-muted"></i>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};