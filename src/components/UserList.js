import React, { memo, useState } from "react";

import { MdAdd } from "react-icons/md";
import { FaUserCheck } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import { API_URL } from '../config';

import classnames from "classnames";
import './InviteContactModal.css';
import { getShortName } from '../utils/userHelpers';
import { COLORS } from "../constants/bgShortColor";

const UserList = ({ users, onAddFriend, handleRemoveFriendRequest }) => {
  
  const [imageError, setImageError] = useState(false);
  const [color] = useState(Math.floor(Math.random() * COLORS.length));

  return (
    <ul className="modal-user-list">
      {users.map((user, index) => {
        const fullName = `${user.name} ${user.surname}`;
        const shortName = getShortName(user);

        return (
          <li key={index} className="modal-user-item">
            <div className="modal-user-item-div">
              <div className="avatar-sm me-2">
                {user?.profileImage && !imageError ? (
                  <img
                    src={`${API_URL}/${user.profileImage}`}
                    alt={fullName}
                    className={classnames("img-fluid rounded-circle", user.isActive ? 'active-user' : '')}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span
                    className={classnames(
                      "avatar-title",
                      "rounded-circle",
                      "text-uppercase",
                      "text-white",
                      COLORS[color]
                    )}
                    style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {shortName}
                  </span>
                )}
              </div>
              <p>{fullName} (@{user.username})</p>
            </div>
            <span>
              {user.friendshipStatus === 'friend_request_pending' ? (
                <BsThreeDots title='bekliyor' className='modal-friends-add-button' onClick={() => handleRemoveFriendRequest(user.userId)} />
              ) : user.friendshipStatus === 'friend_request_received' ? (
                <FaUserCheck className='modal-friends-add-button' />
              ) : (
                <MdAdd
                  className='modal-friends-add-button'
                  onClick={() => onAddFriend(user.userId)}
                />
              )}

            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default memo(UserList);