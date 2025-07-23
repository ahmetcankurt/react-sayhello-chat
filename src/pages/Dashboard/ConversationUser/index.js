import { useEffect, memo } from "react";

// components
import UserHead from "./UserHead";
import Conversation from "./Conversation";
import ChatInputSection from "./ChatInputSection/index";
const Index = ({ replyData, setReplyData, selectedUser, isProfileVisible, setSelectedUser, toggleContentVisibility, handleProfileClick }) => {
  return (
    <>
      <UserHead
        selectedUser={selectedUser}
        isProfileVisible={isProfileVisible}
        setSelectedUser={setSelectedUser}
        toggleContentVisibility={toggleContentVisibility}
        handleProfileClick={handleProfileClick}
      />
      <Conversation
        handleProfileClick={handleProfileClick}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setReplyData={setReplyData}
      />
      <ChatInputSection
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        replyData={replyData}
        setReplyData={setReplyData}
      />
    </>
  )
}

export default memo(Index)