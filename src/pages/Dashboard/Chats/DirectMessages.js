import React, { memo } from "react";
import { UncontrolledTooltip } from "reactstrap";

//components
import AddButton from "../../../components/AddButton";


// component
import ChatUser from "./ChatUser";


const DirectMessages = ({
  users,
  openAddContact,
  selectedChat,
  onSelectChat,
}) => {
  /*
    add contacts
    */
  return (
    <>
      <div className="d-flex align-items-center px-4 mt-5 mb-2">
        <div className="flex-grow-1">
          <h4 className="mb-0 font-size-11 text-muted text-uppercase">
            Direct Messages
          </h4>
        </div>
        <div className="flex-shrink-0">
          <div id="new-message" title="New Message">
            {/* Button trigger modal */}
            <AddButton onClick={openAddContact} /> {/* contactModal */}
          </div>
          <UncontrolledTooltip target="new-message" placement="bottom">
            New Message
          </UncontrolledTooltip>
        </div>
      </div>

      <div className="chat-message-list">
        <ul className="list-unstyled chat-list chat-user-list">
          {(users || []).map((user, key) => (
            <ChatUser
              user={user}
              key={key}
              selectedChat={selectedChat}
              onSelectChat={onSelectChat}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default memo(DirectMessages);
