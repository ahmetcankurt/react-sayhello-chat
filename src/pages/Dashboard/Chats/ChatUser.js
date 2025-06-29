import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { STATUS_TYPES } from "../../../constants";
import { getShortenedMessage } from "../../../utils/getShortenedMessage";
import { formatMessageDate } from "../../../utils/formatMessageDate";
import { API_URL } from "../../../config";
import { getShortName } from '../../../utils/userHelpers';
import { COLORS } from "../../../constants/bgShortColor";

const ChatUser = ({ user, setSelectedUser }) => {
  const fullName = [user?.name, user?.surname].filter(Boolean).join(' ');
  const [imageError, setImageError] = useState(false);
  const shortName = getShortName(user);
  const [color] = useState(Math.floor(Math.random() * COLORS.length));
  const isOnline = user.status && user.status === STATUS_TYPES.ACTIVE;
  const unRead = user.isRead;

  const isSelectedChat = setSelectedUser && setSelectedUser === user.contactId;
  const shortenedMessage = getShortenedMessage(user.lastMessage);

  const handleImageError = () => {
    setImageError(true);
  };


  return (
    <li className={classnames({ active: isSelectedChat })} onClick={() => setSelectedUser({ id: user.contactId, userType: user.type})}>
      <Link  >
        <div className="d-flex">
          <div
            className={classnames(
              "chat-user-img",
              "align-self-center",
              "me-2",
              "ms-0",
              { online: isOnline }
            )}
          >
            {user.profileImage && !imageError ? (
              <>
                <img
                  src={`${API_URL}/${user.profileImage}`}
                  className="rounded-circle avatar-sm"
                  alt={fullName}
                  onError={handleImageError}
                />
                {isOnline && <span className="user-status"></span>}
              </>
            ) : (
              <div className="avatar-sm">
                <span
                  className={classnames(
                    "avatar-title",
                    "rounded-circle",
                    "text-uppercase",
                    "text-white",
                    COLORS[color]
                  )}
                >
                  <span className="username">{shortName}</span>
                  {isOnline && <span className="user-status"></span>}
                </span>
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <div className="text-truncate mb-0">
              {fullName} 
              <div>
                {user.lastMessage && user.lastMessageSender === "ben" ? (
                  <p className="text-truncate mb-0 font-size-12">
                    <span className={classnames("me-1", { "text-success": user?.isRead }, { "text-muted": !user?.isRead })}>
                      <i className={classnames("bx", { "bx-check-double": user?.isRead, "bx-check": !user?.isRead })}></i>
                    </span>
                    {shortenedMessage}
                  </p>
                ) : (
                  <p className="text-truncate mb-0 font-size-12 text-muted" style={{fontWeight: user?.isRead ? "bold" : "normal"}}>
                    {shortenedMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="ms-auto text-end">
            {user.lastMessage && user.lastMessage && (
              <p className="mb-0 font-size-11 text-muted">
                {user.type === "group" && <span className="me-1 text-muted font-size-10"> (Grup)</span>}
                {formatMessageDate(user.lastMessageCreatedAt)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default memo(ChatUser);