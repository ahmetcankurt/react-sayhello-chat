import { memo } from "react";
import classnames from "classnames";
import Menu from "./Menu";
import { API_URL } from "../../../config";
import { getShortName } from "../../../utils/userHelpers";
import renderMessageContent from "./renderMessageContent";
import { useEffect } from "react";
import { Fancybox } from "@fancyapps/ui";
import DelayedImage from "../../../components/DelayedImage";

const Message = ({
  message,
  isFromMe,
  onOpenForward,
  handleUpdate,
  selectedUser,
  setSelectedUser,
  repliedMessage,
  isSelected, // New prop
  setReplyData
}) => {
  const isRepliedMessage = Boolean(message?.replyOf);

  const handleReply = () => setReplyData(message);
  const handleForward = () => onOpenForward(message);

  const senderInfo = message.lastMessageSender && typeof message.lastMessageSender === "object"
    ? message.lastMessageSender
    : message.sender || {};

  // avatar için
  const profileImage = senderInfo.profileImage;
  const name = senderInfo.name || "";
  const surname = senderInfo.surname || "";

  useEffect(() => {
    Fancybox.bind('[data-fancybox="gallery"]');
  }, []);



  return (
    <li
      className={classnames("chat-list", {
        right: isFromMe,
        reply: isRepliedMessage,
        selected: isSelected, // Add selected class
      })}
    >
      <div className="conversation-list mb-1">
        {isSelected && (
          <div className="selection-checkbox">
            <i className="bx bx-check-circle"></i>
          </div>
        )}
        <div>
          <div className="ctext-wrap mb-1">
            <div className={classnames("ctext-wrap-content ", {
              "no-bg p-0": message?.fileType !== "text",
            })}>
              {renderMessageContent({ message, isFromMe, repliedMessage })}
            </div>

            <Menu
              onForward={handleForward}
              onReply={handleReply}
              handleUpdate={handleUpdate}
              messageId={message.messageId}
              Time={message.createdAt}
            />
          </div>

          {!isFromMe && selectedUser.userType === "group" && (
            <div className="conversation-name">
              <div className="chat-avatar me-0 mb-1">
                {profileImage ? (
                  <DelayedImage
                    src={`${API_URL}/${profileImage}`}
                    alt="User"
                    className="rounded-circle"
                  />
                ) : (
                  <div className="avatar-xs">
                    <span
                      className={classnames(
                        "avatar-title rounded-circle text-uppercase text-white",
                      )}
                      style={{ backgroundColor: senderInfo?.color }}
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