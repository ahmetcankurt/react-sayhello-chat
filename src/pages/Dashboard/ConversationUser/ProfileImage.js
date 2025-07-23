import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { STATUS_TYPES } from "../../../constants";
import { API_URL } from "../../../config";
import { getShortName } from "../../../utils/userHelpers";
import { useSelector } from "react-redux";
import DelayedImage from "../../../components/DelayedImage";

export const ProfileImage = ({
  selectedUser,
  toggleContentVisibility,
  handleProfileClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const userData = useSelector((state) => state.selectedUser.userInfo);


  const shortName = getShortName(userData);
  const isOnline =
    userData?.status && userData?.status === STATUS_TYPES.ACTIVE;
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
            {(userData?.profileImage || userData?.groupImage) && !imageError ? (
              <>

                <DelayedImage
                  src={
                    selectedUser?.userType === "user"
                      ? `${API_URL}/${userData?.profileImage}`
                      : `${API_URL}/${userData?.groupImage}`
                  }
                  alt={`${userData?.name || ""} ${userData?.surname || ""}`}
                  className="rounded-circle avatar-sm"
                  onError={handleImageError}
                  fallback={
                    <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bx bx-user text-muted"></i>
                    </div>
                  }
                />
                <span
                  className={classnames("user-status", {
                    "bg-success": userData?.status === STATUS_TYPES.ACTIVE,
                    "bg-warning": userData?.status === STATUS_TYPES.AWAY,
                    "bg-danger":
                      userData?.status === STATUS_TYPES.DO_NOT_DISTURB,
                  })}
                />
              </>
            ) : (
              <div className="avatar-sm align-self-center">
                <span
                  className={classnames(
                    "avatar-title",
                    "rounded-circle",
                    "text-uppercase",
                    "text-white"
                  )}
                  style={{ backgroundColor: userData?.color }}
                >
                  <span className="username user-select-none">{shortName}</span>
                  <span
                    className={classnames("user-status", {
                      "bg-success":
                        userData?.status === STATUS_TYPES.ACTIVE,
                      "bg-warning": userData?.status === STATUS_TYPES.AWAY,
                      "bg-danger":
                        userData?.status === STATUS_TYPES.DO_NOT_DISTURB,
                    })}
                  />
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
