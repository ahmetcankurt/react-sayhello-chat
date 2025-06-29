import React, { memo, useState } from "react";
import { Alert, Form } from "reactstrap";
import StartButtons from "./StartButtons";
import InputSection from "./InputSection";
import EndButtons from "./EndButtons";
import axios from "axios";
import { API_URL } from "../../../../config";
import MoreMenu from "./MoreMenuDropdown";
import "./index.css";
import AudioMessage from "../AudioMessage";

const Index = ({ selectedUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const maxMessageLength = 280;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type.split("/")[0]);
    }
  };

  const onSelectFiles = (files) => {
    if (files && files.length > 0) {
      const firstFile = files[0];
      setFile(firstFile);
      setFileType(firstFile.type.split("/")[0]);
    }
  };

  const handleMessageSend = async () => {
    if ((!message.trim() && !file) || message.length > maxMessageLength || isSending) return;

    setIsSending(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      if (selectedUser?.id && selectedUser?.userType === "user") {
        formData.append("receiverId", selectedUser.id);
      } else if (selectedUser?.id && selectedUser?.userType === "group") {
        formData.append("groupId", selectedUser.id);
      }

      formData.append("content", message);
      formData.append("fileType", file ? fileType : "text");
      if (file) {
        formData.append("file", file);
      }

      await axios.post(`${API_URL}/messages/send`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("");
      setFile(null);
      setFileType(null);
      const fileInput = document.querySelector(".file-input");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Message send error", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        // yönlendirme veya yenileme
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

 const onToggle = (open) => {
  if (typeof open === "boolean") setIsOpen(open);
  else setIsOpen(prev => !prev);
};

  // Emoji state, opsiyonel
  const [emojiArray, setemojiArray] = useState([]);
  const [emojiPicker, setemojiPicker] = useState(false);
  const onEmojiClick = (event) => {
    setemojiArray([...emojiArray, event.emoji]);
    setMessage((prev) => prev + event.emoji);
  };
  const onAudioRecorded = (audioFile) => {
    setFile(audioFile);
    setFileType("audio");
    setMessage("");  // istersen mesaj alanını temizle
  };

  return (
    <div className="chat-input-section p-3 p-lg-4">
      {file && (
        <div className="selected-file-preview mb-2">
          {fileType === "image" && (
            <div className="preview-image mb-2">
              <img src={URL.createObjectURL(file)} alt="Seçilen görsel" />
            </div>
          )}
          {fileType === "audio" && (
            <div className="preview-audio mb-2">
              <AudioMessage src={URL.createObjectURL(file)} />
            </div>
          )}
          {fileType === "video" && (
            <div className="preview-video mb-2">
              <video controls style={{ width: "100%" }} src={URL.createObjectURL(file)} />
            </div>
          )}
          <Alert
            isOpen={true}
            toggle={() => setFile(null)}
            color="secondary"
            className="alert-dismiss-custom font-size-12 m-0 selected-media"
            closeClassName="selected-media-close"
          >
            ({fileType})
          </Alert>
        </div>
      )}

      <Form
        className="chatinput-form"
        id="chatinput-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleMessageSend();
        }}
      >
        <div className="row g-0 align-items-center">
          <div className="col-auto">
            <StartButtons
              onFileChange={handleFileChange}
              onEmojiClick={onEmojiClick}
              emojiPicker={emojiPicker}
              setemojiPicker={setemojiPicker}
              onToggle={onToggle} // <--- bunu ekle
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              onSelectImages={onSelectFiles}
              onSelectFiles={onSelectFiles}
            />


          </div>
          <div className="col">
            <InputSection
              value={message}
              onChange={handleMessageChange}
              disabled={!!file}
              placeholder={file ? "Dosya seçildi, metin yazılamaz" : "Type your message..."}
            />
          </div>
          <div className="col-auto">
            <EndButtons
              onSubmit={handleMessageSend}
              isSending={isSending}
              onAudioRecorded={onAudioRecorded}
            />
          </div>
        </div>
      </Form>

      <MoreMenu isOpen={isOpen} onSelectImages={onSelectFiles} onSelectFiles={onSelectFiles} onToggle={onToggle} />
    </div>
  );
};

export default memo(Index);
