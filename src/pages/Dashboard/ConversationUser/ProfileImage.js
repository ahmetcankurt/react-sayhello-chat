import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { STATUS_TYPES } from "../../../constants";
import { API_URL } from "../../../config";
import { getShortName } from "../../../utils/userHelpers";

import axios from "axios";
export const ProfileImage = ({
  selectedUser,
  toggleContentVisibility,
  handleProfileClick
}) => {
  const [imageError, setImageError] = useState(false);
  const chatUserDetails = {};
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (selectedUser?.id && selectedUser?.userType === "user") {
        try {
          const response = await axios.get(`${API_URL}/users/my-friends-profile/${selectedUser.id}`);
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      else {
        try {
          const response = await axios.get(`${API_URL}/groups/${selectedUser.id}`);
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [selectedUser]);

  const shortName = getShortName(userData);
  const isOnline = userData?.status && userData?.status === STATUS_TYPES.ACTIVE;
  const handleImageError = () => {
    setImageError(true);
  };

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
            {userData?.profileImage && !imageError ? (
              <>
                <img
                  src={`${API_URL}/${userData?.profileImage}`}
                  className="rounded-circle avatar-sm"
                  alt={`${userData?.name} ${userData?.surname}`}
                  onError={handleImageError}
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
                  )}
                  style={{ backgroundColor: userData?.color }}
                >
                  <span className="username user-select-none">{shortName}</span>
                  {isOnline && (
                    <span className={classnames(
                      "user-status",
                      {
                        "bg-success": userData?.status === STATUS_TYPES.ACTIVE,
                      },
                      {
                        "bg-warning": userData?.status === STATUS_TYPES.AWAY,
                      },
                      {
                        "bg-danger": userData?.status === STATUS_TYPES.DO_NOT_DISTURB,
                      }
                    )}></span>
                  )}
                </span>
              </div>
            )}
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <h6 className="text-truncate mb-0 font-size-18">
              <Link
                to="#"
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