import { memo } from "react";
import classnames from "classnames";
import Menu from "./Menu";
import { API_URL } from "../../../config";
import { getShortName } from "../../../utils/userHelpers";
import { COLORS } from "../../../constants/bgShortColor";
import renderMessageContent from "./renderMessageContent";

const getColorIndex = (userId) => {
  if (typeof userId === "string") {
    return [...userId].reduce((acc, char) => acc + char.charCodeAt(0), 0) % COLORS.length;
  }
  return userId % COLORS.length;
};

const Message = ({
  message,
  onSetReplyData,
  isFromMe,
  onOpenForward,
  handleUpdate,
  selectedUser,
  setSelectedUser,
}) => {
  const userId = Number(localStorage.getItem("userId"));
  const colorIndex = getColorIndex(userId);
  const isRepliedMessage = Boolean(message?.replyOf);

  const handleReply = () => onSetReplyData(message);
  const handleForward = () => onOpenForward(message);


  const senderInfo = message.lastMessageSender && typeof message.lastMessageSender === "object"
    ? message.lastMessageSender
    : message.sender || {};

  // avatar için
  const profileImage = senderInfo.profileImage;
  const name = senderInfo.name || "";
  const surname = senderInfo.surname || "";

  return (
    <li className={classnames("chat-list", { right: isFromMe, reply: isRepliedMessage })}>
      <div className="conversation-list mb-1">
        <div>
          <div className="ctext-wrap mb-2">
            <div className={classnames("ctext-wrap-content d-flex", {
              "no-bg p-0": message?.fileType !== "text",
            })}>
              {renderMessageContent({ message, isFromMe })}
            </div>

            <Menu
              onForward={handleForward}
              onReply={handleReply}
              handleUpdate={handleUpdate}
              messageId={message.messageId}
            />
          </div>

          {!isFromMe && selectedUser.userType === "group" && (
            <div className="conversation-name">
              <div className="chat-avatar me-0 mb-1">
                {profileImage ? (
                  <img
                    src={`${API_URL}/${profileImage}`}
                    alt="User"
                    className="rounded-circle"
                  />
                ) : (
                  <div className="avatar-xs">
                    <span
                      className={classnames(
                        "avatar-title rounded-circle text-uppercase text-white",
                        COLORS[colorIndex]
                      )}
                    >
                      <span className="username user-select-none">{getShortName(senderInfo)}</span>
                    </span>
                  </div>
                )}

              </div>
              <span
                className="cursor-pointer ms-1"
                style={{ fontSize: "12px", fontWeight: 500 }}
                onClick={() => setSelectedUser({ id: senderInfo.userId, userType: "user" })}
              >
                {name} {surname}
              </span>

            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default memo(Message);