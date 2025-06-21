import { memo, useEffect, useRef } from "react";
import classnames from "classnames";

// utils
import FormatTime from "../../../hooks/formatTime";
import { API_URL } from "../../../config";
import { getShortName } from "../../../utils/userHelpers";
import { COLORS } from "../../../constants/bgShortColor";
import Menu from "./Menu";
import axios from "axios";

const Message = ({ message, onSetReplyData, isFromMe, onOpenForward, handleUpdate, selectedUser, setSelectedUser }) => {

  const messageRef = useRef(null);
  const userId = Number(localStorage.getItem("userId"));
  const colorIndex = getColorIndex(userId);
  function getColorIndex(userId) {
    if (typeof userId === 'string') {
      let hash = 0;
      for (let i = 0; i < userId.length; i++) {
        hash += userId.charCodeAt(i);
      }
      return hash % COLORS.length;
    }
    return userId % COLORS.length;
  }

  const onClickReply = () => {
    onSetReplyData(message);
  };

  const onForwardMessage = () => {
    onOpenForward(message);
  };
  const isRepliedMessage = message?.replyOf;


  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting && message.receiverId === userId && !message.isRead) {
  //           axios.put(`${API_URL}/messages/read/${message.messageId}`)
  //         }
  //       });
  //     },
  //     { threshold: 1.0 }
  //   );

  //   if (messageRef.current) {
  //     observer.observe(messageRef.current);
  //   }

  //   return () => {
  //     if (messageRef.current) {
  //       observer.unobserve(messageRef.current);
  //     }
  //   };
  // }, [message, userId]);

  const renderMessageContent = () => {
    const { fileType, content, fileUrl } = message;

    if (!fileType) return null;

    switch (fileType) {
      case "text":
        return <p className="mb-0 ctext-content">{content}</p>;

      case "image":
        return (
          <a
            href={`${API_URL}${fileUrl}`}
            data-fancybox="gallery"
            data-caption={
              message.sender
                ? `${message.sender.name} ${message.sender.surname} ${FormatTime(message?.createdAt)}`
                : `${FormatTime(message?.createdAt)}`
            }
          >
            <img
              className="rounded border message-img"
              src={`${API_URL}${fileUrl}`}
              alt={message.sender ? message.sender.name : "Resim"}
              style={{
                maxWidth: "100%",
                borderRadius: "5px",
                height: "300px",
                objectFit: "cover",
              }}
            />
          </a>
        );

   case "video":
  return (
    <a
      data-fancybox="gallery"
      data-type="iframe"
      href={`${API_URL}${fileUrl}`}
      data-caption={
        message.sender
          ? `${message.sender.name} ${message.sender.surname} ${FormatTime(message?.createdAt)}`
          : `${FormatTime(message?.createdAt)}`
      }
    >
      <video
        src={`${API_URL}${fileUrl}`}
        controls
        style={{
          borderRadius: "8px",
          maxWidth: "100%",
          height: "300px",
          objectFit: "cover",
        }}
        muted
      />
    </a>
  );


      case "audio":
        return (
          <audio controls style={{ display: "flex", justifyContent: "center" }}>
            <source src={`${API_URL}${fileUrl}`}
              type="audio/mp3" />
          </audio>

        );

      case "file":
        return (
          <a
            href={`${API_URL}${fileUrl}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            Dosyayı indir
          </a>
        );

      default:
        return <span>Desteklenmeyen dosya türü</span>;
    }
  };


  return (
    <li className={classnames("chat-list", { right: isFromMe }, { reply: isRepliedMessage })} ref={messageRef}>
      <div className="conversation-list mb-1">

        <div className="user-chat-content">
          {message && (
            <div className="ctext-wrap mb-2">
              <div className="ctext-wrap-content">
                {renderMessageContent()}
              </div>

              <Menu
                onForward={onForwardMessage}
                onReply={onClickReply}
                handleUpdate={handleUpdate}
                messageId={message.messageId}
              />
            </div>
          )}


          <div className="conversation-name">
            {isFromMe ? (
              <>
                <span className={classnames("me-1", { "text-success": message?.isRead }, { "text-muted": !message?.isRead })}>
                  <i className={classnames("bx", { "bx-check-double": message?.isRead, "bx-check": !message?.isRead })}></i>
                </span>
                <small className="text-muted mb-0 me-2">{FormatTime(message?.createdAt)}</small>
              </>
            ) : (
              <>
                {selectedUser.userType === "group" && (
                  <>
                    <div className="chat-avatar me-0 mb-1">
                      {message?.sender?.profileImage ? (
                        <img src={`${API_URL}/${message?.sender.profileImage}`} alt="User" />
                      ) : (
                        <div className="avatar-xs">
                          <span
                            className={classnames(
                              "avatar-title",
                              "rounded-circle",
                              "text-uppercase",
                              "text-white",
                              COLORS[colorIndex]
                            )} >
                            <span className="username">
                              {message?.sender ? getShortName(message.sender) : "?"}
                            </span>

                          </span>
                        </div>
                      )}
                    </div>
                    <span
                      className="cursor-pointer"
                      onClick={() => setSelectedUser({ id: message.sender.userId, userType: "user" })}
                    >
                      {message?.sender.name} {message?.sender.surname}
                    </span>
                    <small className="text-muted mb-0 ">{FormatTime(message?.createdAt)}</small>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default memo(Message);