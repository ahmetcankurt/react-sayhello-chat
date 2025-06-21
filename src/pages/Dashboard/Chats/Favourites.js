// component
import { memo } from "react";
import ChatUser from "./ChatUser";

const Favourites = ({ users, selectedChat, setSelectedUser }) => {
  return (
    <>
      {/* <h5 className="mb-3 px-4 mt-4 font-size-11 text-muted text-uppercase">
        Favourites
      </h5> */}

      <div className="chat-message-list">
        <ul className="list-unstyled chat-list chat-user-list">
          {(users || []).map((user, key) => (
            <ChatUser
              user={user}
              key={key}
              selectedChat={selectedChat}
              setSelectedUser={setSelectedUser}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default memo(Favourites);
