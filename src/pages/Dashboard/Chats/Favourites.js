// component
import { memo } from "react";
import ChatUser from "./ChatUser";

const Favourites = ({ users, selectedChat, setSelectedUser, userId, activeTab }) => {
  // users içinde lastMessageCreatedAt bilgisi var mı kontrol et, yoksa 0 koy
  const sortedUsers = (users || []).slice().sort((a, b) => {
    const hasMessageA = !!a.lastMessageCreatedAt;
    const hasMessageB = !!b.lastMessageCreatedAt;

    // Eğer sadece biri mesaj içeriyorsa, o yukarı gelsin
    if (hasMessageA && !hasMessageB) return -1;
    if (!hasMessageA && hasMessageB) return 1;

    // Her ikisi de mesaj içeriyor veya ikisi de mesaj içermiyor
    const dateA = new Date(a.lastMessageCreatedAt || a.createdAt || 0);
    const dateB = new Date(b.lastMessageCreatedAt || b.createdAt || 0);
    return dateB - dateA;
  });

  return (
      <div className="position-relative">
        <ul className="list-unstyled chat-list chat-user-list">
           { sortedUsers.map((user, key) => (
              <ChatUser
                activeTab={activeTab}
                key={`${user.type}_${user.contactId}_${key}`}
                user={user}
                userId={userId}
                selectedChat={selectedChat}
                setSelectedUser={setSelectedUser}
              />
            ))}
        </ul>
      </div>
  )
}

export default memo(Favourites);