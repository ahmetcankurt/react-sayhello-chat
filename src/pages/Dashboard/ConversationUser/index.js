import React, { useCallback, useEffect, useState } from "react";

// components
import UserHead from "./UserHead";
import Conversation from "./Conversation";
import ChatInputSection from "./ChatInputSection/index";



const Index = ({ selectedUser, isProfileVisible, setSelectedUser, toggleContentVisibility, handleProfileClick }) => {

  return (
    <>
      <UserHead
        selectedUser={selectedUser}
        isProfileVisible={isProfileVisible}
        setSelectedUser={setSelectedUser}
        toggleContentVisibility={toggleContentVisibility}
        handleProfileClick={handleProfileClick}
      />
      <Conversation selectedUser={selectedUser} />
      <ChatInputSection
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}

      // onSend={onSend}
      // replyData={replyData}
      // onSetReplyData={onSetReplyData}
      // chatUserDetails={chatUserDetails}
      />
    </>
  );
};

export default Index;
