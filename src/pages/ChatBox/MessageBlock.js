import React, { memo } from "react";
import Dropdown from "./Dropdown"
import ISReady from "./ISReady"
import formatTime from "../../hooks/formatTime"; // Yeni isimlendirme
import { BsThreeDotsVertical } from "react-icons/bs";

function MessageBlock( { message, index, isRead, toggleDropdown, dropdownVisible, userId } ) {
  console.log("render MessageBlock")
  return (
    <div  className={`message ${message.senderId == userId ? 'senderId' : 'receiverId'}`}>
          {message.senderId == userId && (
            <>
              <Dropdown
                visible={dropdownVisible === index}
                onToggle={() => toggleDropdown(index)}
              />
              <BsThreeDotsVertical
                className="chat-dots-icon"
                onClick={() => toggleDropdown(index)}
              />

            </>
          )}
          <div >
            <p className={`message-content ${message.senderId == userId ? 'senderId' : 'receiverId'}`}>{message.content}</p>
            {message.senderId == userId && (
              <ISReady isRead={isRead} />
            )}
            <span className="message-clock">{formatTime(message.createdAt)}</span>
            {message.receiverId == userId && (
              <ISReady isRead={isRead} />
            )}
          </div>
          {message.receiverId == userId && (
            <>
              <BsThreeDotsVertical
                className="chat-dots-icon"
                onClick={() => toggleDropdown(index)}
              />
              <Dropdown
                visible={dropdownVisible === index}
                onToggle={() => toggleDropdown(index)}
              />
            </>
          )}
        </div>
  );
}

export default memo(MessageBlock);