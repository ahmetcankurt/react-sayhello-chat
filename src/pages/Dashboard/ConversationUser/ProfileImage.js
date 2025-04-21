import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
  Alert,
  UncontrolledTooltip,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

// components
import AudioCallModal from "../../../components/AudioCallModal";
import VideoCallModal from "../../../components/VideoCallModal";
import AddPinnedTabModal from "../../../components/AddPinnedTabModal";


// constants
import { STATUS_TYPES } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";


import { Search } from "./Search";
import { setUserId } from "../../../redux/slices/selectedUser";

import {API_URL} from "../../../config";

export const ProfileImage = ({
  selectedUser,
  toggleContentVisibility,
  handleProfileClick

}) => {
  const chatUserDetails = {};
  const userData = useSelector((state) => state.selectedUser.userInfo);

  const shortName = selectedUser
    ? userData?.name
      ? `${userData?.name.charAt(0)} ${userData?.surname.charAt(0)}`
      : "-"
    : "#";

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

  const isOnline =
    userData?.status && userData?.status === STATUS_TYPES.ACTIVE;

  return (
    <div className="d-flex align-items-center">
      <div className="flex-shrink-0 d-block d-lg-none me-2">
        <Link
          to="#"
          onClick={toggleContentVisibility}
          className="user-chat-remove text-muted font-size-24 p-2"
        >
          <i className="bx bx-chevron-left align-middle"></i>
        </Link>
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <div className="d-flex align-items-center">
          <div
            className={classnames(
              "flex-shrink-0",
              "chat-user-img",
              "align-self-center",
              "me-3",
              "ms-0",
              { online: isOnline }
            )}
          >
            {userData?.profileImage ? (
              <>
                <img
                  src={`${API_URL}/${userData?.profileImage}`}
                  className="rounded-circle avatar-sm"
                  alt="profileImage"
                />
                <span
                  className={classnames(
                    "user-status",
                    {
                      "bg-success":
                        chatUserDetails?.status === STATUS_TYPES.ACTIVE,
                    },
                    {
                      "bg-warning":
                        chatUserDetails?.status === STATUS_TYPES.AWAY,
                    },
                    {
                      "bg-danger":
                        chatUserDetails?.status === STATUS_TYPES.DO_NOT_DISTURB,
                    }
                  )}
                ></span>
              </>
            ) : (
              <div className="avatar-sm align-self-center">
                <span
                  className={classnames(
                    "avatar-title",
                    "rounded-circle",
                    "text-uppercase",
                    "text-white",
                    colors[color]
                  )}
                >
                  <span className="username"> {shortName}</span>
                  <span className="user-status"></span>
                </span>
              </div>
            )}
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <h6 className="text-truncate mb-0 font-size-18">
              <Link
                to="#"
                // onClick={onOpenUserDetails}
                className="user-profile-show text-reset"
                onClick={handleProfileClick}
              >
                {userData?.name} {userData?.surname}
              </Link>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};