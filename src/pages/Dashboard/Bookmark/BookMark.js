import React, { useEffect, useState } from "react";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { Link } from "react-router-dom";

// hooks
import { useRedux } from "../../../hooks/index";
import UpdateDeleteBookmark from "../../../components/UpdateDeleteBookmark";

const BookMark = ({ bookmark, onUpdate, onDelete }) => {
  // global store
  const { useAppSelector } = useRedux();

 
  // Inside your component
  const { isBookmarkUpdated} = useAppSelector();


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  /*
    update modal
    */
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    if (isBookmarkUpdated) {
      setIsOpen(false);
    }
  }, [isBookmarkUpdated]);

  const onDeleteBookmark = () => {
    onDelete(bookmark.id);
  };

  const onUpdateBookmark = (data) => {
    const params = {
      ...bookmark,
      title: data.bookmarkTitle,
    };
    onUpdate(bookmark.id, params);
  };

  return (
    <>
      <li>
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0 avatar-xs ms-1 me-3">
            <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
              <i className={bookmark.icon}></i>
            </div>
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-truncate p-0">
                {bookmark.title}
              </Link>
            </h5>
            <p className="text-muted text-truncate font-size-13 mb-0">
              {bookmark.desc}
            </p>
          </div>

          <div className="flex-shrink-0 ms-3">
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle
                color="none"
                className="font-size-16 text-muted px-1"
                role="button"
              >
                <i className="bx bx-dots-horizontal-rounded"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem className="d-flex align-items-center justify-content-between">
                  Open <i className="bx bx-folder-open ms-2 text-muted"></i>
                </DropdownItem>
                <DropdownItem
                  onClick={onOpen}
                  className="d-flex align-items-center justify-content-between"
                >
                  Edit <i className="bx bx-pencil ms-2 text-muted"></i>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                 
                  className="d-flex align-items-center justify-content-between"
                >
                  Delete <i className="bx bx-trash ms-2 text-muted"  onClick={onDeleteBookmark}></i>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </li>
      {isOpen && (
        <UpdateDeleteBookmark
          isOpen={isOpen}
          onClose={onClose}
          onUpdate={onUpdateBookmark}
          bookmark={bookmark}
        />
      )}
    </>
  );
};

export default BookMark;
