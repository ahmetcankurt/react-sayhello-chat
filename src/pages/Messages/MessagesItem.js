import { memo, useEffect, useCallback } from "react";
import UserImage from "../../Component/UserImage";
import ISRead from "../../Component/ISRead";
import { getShortenedMessage } from "../../utils/getShortenedMessage"
import { capitalize } from "../../utils/stringUtils";
import { API_URL } from "../../config";
import { Fancybox } from "@fancyapps/ui";


function MessagesItem({ message, setSelectedUser, selectedUser }) {
    const { lastMessage, name, surname, userId, profileImage, isActive, lastMessageSender, isRead } = message;
    const shortenedMessage = getShortenedMessage(lastMessage);
    const isActiveUser = userId === selectedUser;
    const fullName = `${capitalize(name)} ${capitalize(surname)}`;

    // Handle user selection
    const handleClick = useCallback(() => {
        setSelectedUser(userId);
    }, [setSelectedUser, userId]);

    // Bind Fancybox for profile image viewing
    useEffect(() => {
        const fancyboxOptions = { Toolbar: false, smallBtn: true };
        Fancybox.bind("[data-fancybox]", fancyboxOptions);

        return () => Fancybox.unbind("[data-fancybox]");
    }, []);

    const messageStyle = lastMessageSender === "ben"
        ? { color: "#555" }
        : { color: isRead ? "#555" : "black", fontWeight: isRead ? "normal" : "bold" };

    return (
        <div className={`messages-blog ${isActiveUser ? "active" : ""}`}>
            <a data-fancybox={`user-${userId}`} href={`${API_URL}/${profileImage}`}>
                <UserImage height="50" width="50" src={profileImage} isActive={isActive} />
            </a>
            <div onClick={handleClick}>
                <span>{fullName}</span>
                <p className="messages-detail m-0">
                    {lastMessageSender === "ben" ? (
                        <>
                            <ISRead isRead={isRead} />
                            <span className="ms-1" style={messageStyle}>
                                {shortenedMessage}
                            </span>
                        </>
                    ) : (
                        <span className="ms-1" style={messageStyle}>
                            {shortenedMessage}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}

export default memo(MessagesItem);


// socket.on("messageRead", ({ messageId, isRead }) => {
//     setMessages();
//   });

//   return () => {
//     socket.off("messageRead");
//   };
// }, []);