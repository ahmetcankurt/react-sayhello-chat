import { memo } from "react";
import ChatBox from "./ChatBox";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";

const Chat = ({ selectedUser }) => {
  return (
    <div className="chat-container">
      <div className="">
        <ChatHeader selectedUser={selectedUser} />
      </div>
      <ChatBox selectedUser={selectedUser}  />
      <ChatFooter selectedUser={selectedUser}  />
    </div>
  );
};

export default memo(Chat)
