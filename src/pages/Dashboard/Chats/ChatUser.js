import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

import { STATUS_TYPES } from "../../../constants";
import { getShortenedMessage } from "../../../utils/getShortenedMessage";
import { formatMessageDate } from "../../../utils/formatMessageDate";

import { API_URL } from "../../../config";



const ChatUser = ({ user, setSelectedUser }) => {
  const fullName = `${user.name} ${user.surname}`;
  const shortName = `${user.name.charAt(0)}${user.surname.charAt(0)}`;

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
  const isOnline = user.status && user.status === STATUS_TYPES.ACTIVE;
  const unRead = user.meta && user.meta.unRead;

  const isSelectedChat =
    setSelectedUser && setSelectedUser === user.userId ? true : false;
  const shortenedMessage = getShortenedMessage(user.lastMessage);

  return (
    <li className={classnames({ active: isSelectedChat })} onClick={() => setSelectedUser(user.userId)}>
      <Link to="#" className={classnames({ "unread-msg-user": unRead })}>
        <div className="d-flex ">
          <div
            className={classnames(
              "chat-user-img",
              "align-self-center",
              "me-2",
              "ms-0",
              { online: isOnline }
            )}
          >
            {user.profileImage ? (
              <>
                <img
                  src={`${API_URL}/${user.profileImage}`}
                  className="rounded-circle avatar-sm"
                  alt=""
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
                    colors[color]
                  )}
                >
                  <span className="username">{shortName}</span>
                  <span className="user-status"></span>
                </span>

              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <div className="text-truncate mb-0">{fullName}
              <div>
                {user.lastMessage && !user.isDeleted ? (
                  <p className="text-truncate mb-0 font-size-12">
                    <span className={classnames("me-1", { "text-success": user?.isRead }, { "text-muted": !user?.isRead })}>
                      <i className={classnames("bx", { "bx-check-double": user?.isRead, "bx-check": !user?.isRead })}></i>
                    </span>
                    {shortenedMessage}
                  </p>
                ) : (
                  <p className="text-truncate mb-0 font-size-12 text-muted">
                    {shortenedMessage}
                  </p>
                )}

              </div>
            </div>
          </div>
          <div className="ms-auto text-end">
            {user.lastMessage && user.lastMessage ? (
              <p className="mb-0 font-size-11 text-muted">
                {formatMessageDate(user.lastMessageCreatedAt)}
              </p>
            ) : null}
          </div>

          {unRead && unRead !== 0 ? (
            <div className="ms-auto">
              <span className="badge badge-soft-dark rounded p-1">
                {unRead}
              </span>
            </div>
          ) : null}
        </div>

      </Link>
    </li>
  );
};

export default memo(ChatUser);
