import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

// components
import AppSimpleBar from "./AppSimpleBar";

import { Link } from "react-router-dom";

const Pin = ({ pin }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);
  

  return (
    <li>
      <div className="d-flex align-items-center">
        <div className="flex-shrink-0 avatar-xs me-3">
          <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
            <i className={pin.icon}></i>
          </div>
        </div>
        <div className="flex-grow-1 overflow-hidden">
          <h5 className="font-size-14 text-truncate mb-1">
            <Link to="#" className="p-0">
              {pin.title}
            </Link>
          </h5>
          <p className="text-muted font-size-13 mb-0">{pin.desc}</p>
        </div>

        <div className="flex-shrink-0 ms-3">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle
              tag="a"
              className="font-size-18 text-muted px-1"
              role="button"
            >
              <i className="bx bx-dots-horizontal-rounded"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                href="#"
              >
                Open <i className="bx bx-folder-open ms-2 text-muted"></i>
              </DropdownItem>
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                href="#"
              >
                Edit <i className="bx bx-pencil ms-2 text-muted"></i>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                href="#">
                Delete {" "} <i className="bx bx-trash ms-2 text-muted"></i>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </li>
  );
};

const AddPinnedTabModal = ({
  isOpen,
  onClose,
  pinnedTabs,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      className="pinnedtabModal"
      tabIndex={-1}
      contentClassName="shadow-lg border-0"
      centered
      scrollable
    >
      <ModalBody className="p-0 ">
      <ModalHeader toggle={onClose} className="bg-primary">
      <div className="modal-title modal-title-custom text-white bg-primary font-size-16">
      BookMark
      </div>
     </ModalHeader>
        <div className="modal-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div className="flex-grow-1">
              <div>
                <h5 className="font-size-16 mb-0">10 Pinned tabs</h5>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div>
                <button type="button" className="btn btn-sm btn-soft-primary">
                  <i className="bx bx-plus"></i> Pin
                </button>
              </div>
            </div>
          </div>
          <AppSimpleBar
            style={{ maxHeight: "299px" }}
            className="chat-bookmark-list mx-n4"
          >
            <ul className="list-unstyled chat-list">
              {(pinnedTabs || []).map((pin, key) => (
                <Pin pin={pin} key={key} />
              ))}
            </ul>
          </AppSimpleBar>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AddPinnedTabModal;