import React, { useEffect, useRef, useState } from "react";
import { Alert, Form } from "reactstrap";

// components
import StartButtons from "./StartButtons";
import InputSection from "./InputSection";
import EndButtons from "./EndButtons";
import MoreMenu from "./MoreMenu";
import Reply from "./Reply";
import axios from "axios";

import { io } from "socket.io-client";
import {API_URL} from "../../../../config";

const Index = ({
  selectedUser,
}) => {
  /*
  more menu collapse
  */
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef(null);
  const userId = Number(localStorage.getItem("userId"));
  const maxMessageLength = 280; // Max character limit for the message


  useEffect(() => {
    socketRef.current = io(API_URL);
    return () => {
      socketRef.current.disconnect();
    };
  }, []);


  const [images, setImages] = useState();
  const onSelectImages = (images) => {
    setImages(images);
  };

  const [files, setFiles] = useState();
  const onSelectFiles = (files) => {
    setFiles(files);
  };


  // emoji picker 
  const [emojiPicker, setemojiPicker] = useState(false);
  const onEmojiClick = (event) => {
    const emoji = event.emoji;
    setMessage(prev => prev + emoji);
  };


  const onClearMedia = () => {
    setImages(null);
    setFiles(null);
  };

  const handleMessageSend = async () => {
    if (!message.trim() || message.length > maxMessageLength || isSending) return;
    setIsSending(true);
    try {
      const response = await axios.post(`${API_URL}/messages`, {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
      });
  
      // Emit the message to both sender and receiver
      socketRef.current.emit('newMessage', {
        senderId: userId,
        receiverId: selectedUser,
        content: message,
        createdAt: new Date().toISOString(),
        messageId: response.data.messageId
      });
  
      // Reset message input
      setMessage('');
      const textarea = document.querySelector(".chat-search-input");
      if (textarea) {
        textarea.style.height = "auto";
      }
    } catch (error) {
      console.error("Message send error", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleMessageChange = (e) => {
      setMessage(e.target.value);
  };
  

  return (
    <div className="chat-input-section p-3 p-lg-4">
      <Form
        id="chatinput-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleMessageSend();
        }}
      >
        <div className="row g-0 align-items-center">
          <div className="col-auto">
            <StartButtons
              onToggle={onToggle}
              onEmojiClick={onEmojiClick}
              setemojiPicker={setemojiPicker}
              emojiPicker={emojiPicker}
            />
          </div>
          <div className="col">
            <InputSection value={message} onChange={handleMessageChange} />
          </div>
          <div className="col-auto">
            <EndButtons onSubmit={handleMessageSend} />
          </div>
        </div>
      </Form>
      {(images && images.length) || (files && files.length) ? (
        <Alert
          isOpen={true}
          toggle={onClearMedia}
          color="secondary"
          className="alert-dismiss-custom 
        rounded-pill font-size-12 mb-1 selected-media"
          closeClassName="selected-media-close"
        >
          <p className="me-2 mb-0">
            {images && !files && ` You have selected ${images.length} images`}
            {files && !images && ` You have selected ${files.length} files`}
            {files &&
              images &&
              ` You have selected ${files.length} files & ${images.length} images.`}
          </p>
        </Alert>
      ) : null}

      {/* <MoreMenu
        isOpen={isOpen}
        onSelectImages={onSelectImages}
        onSelectFiles={onSelectFiles}
        onToggle={onToggle}
      /> */}

      {/* <Reply
        reply={replyData}
        onSetReplyData={onSetReplyData}
        chatUserDetails={chatUserDetails}
      /> */}
    </div>
  );
};

export default Index;
