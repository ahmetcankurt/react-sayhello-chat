import { memo } from "react";
import ChatBox from "./ChatBox";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";

const Chat = ({ selectedUser,handleProfileClick }) => {
  return (
    <div className="chat-container">
      <div className="">
        <ChatHeader selectedUser={selectedUser} handleProfileClick={handleProfileClick} />
      </div>
      <ChatBox selectedUser={selectedUser}  />
      <ChatFooter selectedUser={selectedUser}  />
    </div>
  );
};

export default memo(Chat)
