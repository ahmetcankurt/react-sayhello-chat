import { memo } from "react";
import ChatBox from "./ChatBox";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";

const Chat = ({ selectedUser, handleProfileClick }) => {
  return (
    <div className="chat-container">
      <>
        <ChatHeader selectedUser={selectedUser} handleProfileClick={handleProfileClick} />
      </>
      <ChatBox selectedUser={selectedUser} />
      <ChatFooter selectedUser={selectedUser} />
    </div>
  );
};

export default memo(Chat)