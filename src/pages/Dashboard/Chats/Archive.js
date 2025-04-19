// component
import ChatUser from "./ChatUser";
import ChatChannel from "./ChatChannel";
import { memo } from "react";

const Archive = ({
  archiveContacts,
  selectedChat,
  onSelectChat,
}) => {
  return (
    <>
      <h5 className="mb-3 px-4 mt-4 font-size-11 text-muted text-uppercase">
      Archived
      </h5>

      <div className="chat-message-list">
        <ul className="list-unstyled chat-list chat-user-list">
          {(archiveContacts || []).map((chat, key) => {
            if (chat.isChannel) {
              return (
                <ChatChannel
                  channel={chat}
                  key={key}
                  selectedChat={selectedChat}
                  onSelectChat={onSelectChat}
                />
              );
            } else {
              return (
                <ChatUser
                  user={chat}
                  key={key}
                  selectedChat={selectedChat}
                  onSelectChat={onSelectChat}
                />
              );
            }
          })}
        </ul>
      </div>
    </>
  );
};

export default memo(Archive);