import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  Alert,
  UncontrolledTooltip,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

// components
import AudioCallModal from "../../../components/AudioCallModal";
import VideoCallModal from "../../../components/VideoCallModal";
import AddPinnedTabModal from "../../../components/AddPinnedTabModal";


// constants
import { STATUS_TYPES } from "../../../constants";
import { useSelector } from "react-redux";

import config from "../../../config";
import { Search } from "./Search";
import { ProfileImage } from "./ProfileImage";
import { More } from "./More";

const UserHead = ({
  selectedUser,
  toggleContentVisibility,
  setSelectedUser,
  isProfileVisible,
  handleProfileClick,
}) => {
  const [isOpenVideoModal, setIsOpenVideoModal] = useState(false);
  const onOpenVideo = () => {
    setIsOpenVideoModal(true);
  };
  const onCloseVideo = () => {
    setIsOpenVideoModal(false);
  };

  /*
        audio call modal
    */
  const [isOpenAudioModal, setIsOpenAudioModal] = useState(false);
  const onOpenAudio = () => {
    setIsOpenAudioModal(true);
  };
  const onCloseAudio = () => {
    setIsOpenAudioModal(false);
  };

  /*
  pinned tab modal
  */
  const [isOpenPinnedTabModal, setIsOpenPinnedTabModal] =
    useState(false);
  const onOpenPinnedTab = () => {
    setIsOpenPinnedTabModal(true);
  };
  const onClosePinnedTab = () => {
    setIsOpenPinnedTabModal(false);
  };

  /*
  mobile menu chat conversation close
  */
  const onCloseConversation = () => {
  };

  return (
    <div className="p-3 p-lg-3 user-chat-topbar">
      <Row className="align-items-center">
        <Col sm={4} className="col-8">
          <ProfileImage
            selectedUser={selectedUser}
            toggleContentVisibility={toggleContentVisibility}
            setSelectedUser={setSelectedUser}
            onCloseConversation={onCloseConversation}
            isProfileVisible={isProfileVisible}
            handleProfileClick={handleProfileClick}
          />
        </Col>
        <Col sm={8} className="col-4">
          <ul className="list-inline user-chat-nav text-end mb-0">
            {/* <li className="list-inline-item  ">
              <Search />
            </li>
            <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
              <Button
                type="button"
                color="none"
                className="btn nav-btn"
                onClick={onOpenAudio}
              >
                <i className="bx bxs-phone-call"></i>
              </Button>
            </li> */}

            {/* <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
              <Button
                type="button"
                color="none"
                className="btn nav-btn"
                onClick={onOpenVideo}
              >
                <i className="bx bx-video"></i>
              </Button>
            </li> */}

            {/* <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
              <button
                // onClick={onOpenUserDetails}
                type="button"
                className="btn nav-btn user-profile-show"
              >
                <i className="bx bxs-info-circle"></i>
              </button>
            </li> */}

            {/* <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
              <More
                onOpenAudio={onOpenAudio}
                onOpenVideo={onOpenVideo}
              // onDelete={onDelete}
              // isArchive={chatUserDetails.isArchived}
              // onToggleArchive={onToggleArchive}
              />
            </li> */}
          </ul>
        </Col>
      </Row>
      {isOpenAudioModal && (
        <AudioCallModal
          isOpen={isOpenAudioModal}
          onClose={onCloseAudio}
        // user={chatUserDetails}
        />
      )}
      {isOpenVideoModal && (
        <VideoCallModal
          isOpen={isOpenVideoModal}
          onClose={onCloseVideo}
        // user={chatUserDetails}
        />
      )}
     
    </div>
  );
};

export default UserHead;
