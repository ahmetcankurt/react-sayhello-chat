import React, { memo, useEffect, useRef, useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";

// components
import LightBox from "../../../components/LightBox";

//images
import imagePlaceholder from "../../../assets/images/users/user-dummy-img.jpg";


// utils
import { formateDate } from "../../../utils";
import RepliedMessage from "./RepliedMessage";
import FormatTime from "../../../hooks/formatTime";
import { API_URL } from "../../../config";
import axios from "axios";
import { getShortName } from "../../../utils/userHelpers";
import { COLORS } from "../../../constants/bgShortColor";

const Menu = ({ onDelete, onReply, onForward, handleUpdate, messageId }) => {
  return (
    <UncontrolledDropdown className="align-self-start message-box-drop">
      <DropdownToggle className="btn mb-0 pb-0 btn-toggle" role="button" tag={"a"}>
        <i className="ri-more-2-fill"></i>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={onReply}>
          Reply <i className="bx bx-share ms-2 text-muted"></i>
        </DropdownItem>
        <DropdownItem onClick={onForward}>
          Forward <i className="bx bx-share-alt ms-2 text-muted"></i>
        </DropdownItem>
        <DropdownItem>
          Copy <i className="bx bx-copy text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem>
          Bookmark <i className="bx bx-bookmarks text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem>
          Mark as Unread <i className="bx bx-message-error text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between delete-item"
          onClick={() => handleUpdate(messageId)}
        >
          Delete <i className="bx bx-trash text-muted ms-2"></i>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};


const ImageMoreMenu = ({ imagelink, onReply, onDelete }) => {
  return (
    <div className="message-img-link">
      <ul className="list-inline mb-0">
        <UncontrolledDropdown
          tag="li"
          color="none"
          className="list-inline-item dropdown"
        >
          <DropdownToggle tag="a" role="button" className="btn btn-toggle">
            <i className="bx bx-dots-horizontal-rounded"></i>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              className="dropdown-item d-flex align-items-center justify-content-between"
              href={imagelink}
              download
            >
              Download <i className="bx bx-download ms-2 text-muted"></i>
            </DropdownItem>
            <DropdownItem
              tag="a"
              className=" d-flex align-items-center justify-content-between"
              href="#"
              onClick={onReply}
            >
              Reply <i className="bx bx-share ms-2 text-muted"></i>
            </DropdownItem>
            <DropdownItem
              tag="a"
              className=" d-flex align-items-center justify-content-between"
              href="#"
              data-bs-toggle="modal"
              data-bs-target=".forwardModal"
            >
              Forward <i className="bx bx-share-alt ms-2 text-muted"></i>
            </DropdownItem>
            <DropdownItem
              tag="a"
              className=" d-flex align-items-center justify-content-between"
              href="#"
            >
              Bookmark <i className="bx bx-bookmarks text-muted ms-2"></i>
            </DropdownItem>
            <DropdownItem
              tag="a"
              className=" d-flex align-items-center justify-content-between delete-item"
              href="#"
              onClick={onDelete}
            >
              Delete <i className="bx bx-trash ms-2 text-muted"></i>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </ul>
    </div>
  );
};


const Image = ({ message, image, onImageClick, index, onSetReplyData, onDeleteImg }) => {
  const onDelete = () => {
    onDeleteImg(image.id);
  };
  const onClickReply = () => {

    let multiimages = message['image'];

    let results = multiimages.filter((multiimage) => multiimage.id === image.id);

    message['newimage'] = results;

    onSetReplyData(message);

  };
  return (
    <React.Fragment>
      <div className="message-img-list">
        <div>
          <Link
            className="popup-img d-inline-block"
            to={"#"}
            onClick={() => onImageClick(index)}
          >
            <img src={image.downloadLink} alt="" className="rounded border" />
          </Link>
        </div>
        <ImageMoreMenu imagelink={image.downloadLink} onReply={onClickReply} onDelete={onDelete} />
      </div>
    </React.Fragment>
  );
};

const Images = ({ message, images, onSetReplyData, onDeleteImg }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const onImageClick = (id) => {
    setSelected(id);
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="message-img mb-0">
        {(images || []).map((image, key) => (
          <Image
            message={message}
            image={image}
            key={key}
            index={key}
            onImageClick={onImageClick}
            onSetReplyData={onSetReplyData}
            onDeleteImg={onDeleteImg}
          />
        ))}
      </div>
      {/* {isOpen && (
        <LightBox
          isOpen={isOpen}
          images={images}
          onClose={onClose}
          defaultIdx={selected}
        />
      )} */}
    </>
  );
};


const Attachments = ({ attachments }) => {
  return (
    <>
      {(attachments || []).map((attachment, key) => (
        <div
          key={key}
          className={classnames("p-3", "border-primary", "border rounded-3", {
            "mt-2": key !== 0,
          })}
        >
          <div className="d-flex align-items-center attached-file">
            <div className="flex-shrink-0 avatar-sm me-3 ms-0 attached-file-avatar">
              <div className="avatar-title bg-primary-subtle text-primary rounded-circle font-size-20">
                <i className="ri-attachment-2"></i>
              </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
              <div className="text-start">
                <h5 className="font-size-14 mb-1">{attachment.name}</h5>
                <p className="text-muted text-truncate font-size-13 mb-0">
                  {attachment.desc}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 ms-4">
              <div className="d-flex gap-2 font-size-20 d-flex align-items-start">
                <div>
                  <a
                    href={attachment.downloadLink ? attachment.downloadLink : "#"}
                    className="text-muted"
                    download
                  >
                    <i className="bx bxs-download"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const Typing = () => {
  return (
    <p className="mb-0">
      typing
      <span className="animate-typing">
        <span className="dot mx-1"></span>
        <span className="dot me-1"></span>
        <span className="dot"></span>
      </span>
    </p>
  );
};



const Message = ({ message, onSetReplyData, isFromMe, onOpenForward, handleUpdate, handleProfileClick, selectedUser, setSelectedUser }) => {
  const [color] = useState(Math.floor(Math.random() * COLORS.length));

  const onClickReply = () => {
    onSetReplyData(message);
  };

  const onForwardMessage = () => {
    onOpenForward(message);
  };
  const isRepliedMessage = message?.replyOf;

  const messageRef = useRef(null);
  const userId = Number(localStorage.getItem("userId"));


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

  return (
    <li className={classnames("chat-list", { right: isFromMe }, { reply: isRepliedMessage })} ref={messageRef}>
      <div className="conversation-list mb-1">

        <div className="user-chat-content">
          {message?.content && (
            <div className="ctext-wrap mb-2">
              <div className="ctext-wrap-content">
                <p className="mb-0 ctext-content">{message?.content}</p>
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
                      {message?.sender.profileImage ? (
                        <img src={`${API_URL}/${message?.sender.profileImage}`} alt="User" />
                      ) : (
                        <div className="avatar-xs">
                          <span
                            className={classnames(
                              "avatar-title",
                              "rounded-circle",
                              "text-uppercase",
                              "text-white",
                              COLORS[color]
                            )} >
                            <span className="username user-select-none">{getShortName(message.sender)}</span>
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