import React, { useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { Badge } from "reactstrap";

import { useContacts } from "../../../hooks";


const Member = ({ member }) => {

  const categorizedContacts = {
    data: [
      {
        id: member,
        firstName: "",
        lastName: "",
        profileImage: "",
      },
    ],
  }

  var fullName = "";
  var shortName = "";
  if (member.firstName) {
    fullName = `${member.firstName} ${member.lastName}`;
    shortName = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;
  } else {

    const result = categorizedContacts.filter(
      categorizedContact => categorizedContact.data[0].id === member
    );

    if (result[0]) {
     
      fullName = result[0].data[0].firstName + " " + result[0].data[0].lastName;
      shortName =
        result[0].data[0].firstName.charAt(0) +
        result[0].data[0].lastName.charAt(0);

    }
  }

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
  const onSelectChat = (id, isChannel) => {
    if (isChannel) {
      // dispatch(getChannelDetails(id));
    } else {
      // dispatch(getChatUserDetails(id));
    }
    // dispatch(getChatUserConversations(id));
    // dispatch(changeSelectedChat(id));
  };

  return (
    <li>
      <Link to="#" onClick={() => onSelectChat(member.id)}>
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0 avatar-xs me-2">
            {member.profileImage ? (
              <div
                className={classnames(
                  "chat-user-img",
                  "align-self-center",
                  "me-2",
                  "ms-0"
                )}
              >
                <img
                  src={member.profileImage}
                  className="rounded-circle avatar-xs"
                  alt=""
                />
              </div>
            ) : (
              <span
                className={classnames(
                  "avatar-title",
                  "rounded-circle",
                  "text-uppercase",
                  "text-white",
                  colors[color]
                )}
              >
                {shortName}
              </span>
            )}
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-truncate mb-0">{fullName}</p>
          </div>
          {member.isAdmin && (
            <div className="ms-auto">
              <Badge className="badge badge-soft-primary rounded p-1">
                Admin
              </Badge>
            </div>
          )}
        </div>
      </Link>
    </li>
  );
};
const Members = ({ chatUserDetails }) => {
  const groups =
    chatUserDetails.members &&
    chatUserDetails.members.length &&
    chatUserDetails.members;
  return (
    <div>
      <div className="d-flex">
        <div className="flex-grow-1">
          <h5 className="font-size-11 text-muted text-uppercase">Members</h5>
        </div>
      </div>

      {groups ? (
        <ul className="list-unstyled chat-list mx-n4">
          {(groups || []).map((member, key) => (
              <Member key={key} member={member} />
          ))}
        </ul>
      ) : (
        <p>No Groups</p>
      )}
    </div>
  );
};

export default Members;
