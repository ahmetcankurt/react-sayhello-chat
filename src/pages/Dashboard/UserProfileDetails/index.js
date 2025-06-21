import React, { useState, useEffect } from "react";
import classnames from "classnames";
// hooks

// components
import AudioCallModal from "../../../components/AudioCallModal";
import VideoCallModal from "../../../components/VideoCallModal";
import AppSimpleBar from "../../../components/AppSimpleBar";
import Loader from "../../../components/Loader";
import ProfileUser from "./ProfileUser";
import Actions from "./Actions";
import BasicDetails from "./BasicDetails";
import Groups from "./Groups";
import Media from "../../../components/Media";
import AttachedFiles from "../../../components/AttachedFiles";
import Status from "./Status";
import Members from "./Members";
import axios from "axios";
import {API_URL} from "../../../config";

const Index = ({ isChannel, isProfileVisible, handleProfileClick, selectedUser }) => {

  const onCloseUserDetails = () => {
  };

  /*
    video call modal
    */
  const [isOpenVideoModal, setIsOpenVideoModal] = useState(false);
  const onOpenVideo = () => {
    setIsOpenVideoModal(true);
  };
  const onCloseVideo = () => {
    setIsOpenVideoModal(false);
  };

  const [isOpenAudioModal, setIsOpenAudioModal] = useState(false);
  const onOpenAudio = () => {
    setIsOpenAudioModal(true);
  };
  const onCloseAudio = () => {
    setIsOpenAudioModal(false);
  };

  const [userInfo, setUserInfo] = useState(null);


  useEffect(() => {
    const fetchUserData = async () => {
      if (selectedUser?.id && selectedUser?.userType === "user") {
        try {
          const response = await axios.get(`${API_URL}/users/my-friends-profile/${selectedUser.id}`);
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      if (selectedUser?.id && selectedUser?.userType === "group") {
        try {
          const response = await axios.get(`${API_URL}/groups/${selectedUser.id}`);
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
  
    fetchUserData();
  }, [selectedUser]);



  return (
    <>
      <div
        className={classnames("user-profile-sidebar", {
          "d-block": isProfileVisible,
        })}
      >
        <div className="position-relative">
          {/* {getUserDetailsLoading && <Loader />} */}

          <ProfileUser
            handleProfileClick={handleProfileClick}
            onCloseUserDetails={onCloseUserDetails}
            userInfo={userInfo}
            onOpenVideo={onOpenVideo}
            onOpenAudio={onOpenAudio}
          />
          {/* <!-- End profile user --> */}

          {/* <AppSimpleBar className="p-4 user-profile-desc">
            <Actions
              chatUserDetails={chatUserDetails}
              onOpenVideo={onOpenVideo}
              onOpenAudio={onOpenAudio}
              onToggleFavourite={onToggleFavourite}
              onToggleArchive={onToggleArchive}
            />
            <Status about={chatUserDetails.about} />
            {!isChannel ? (
              <>
                <BasicDetails chatUserDetails={chatUserDetails} />
                <hr className="my-4" />
                <Groups chatUserDetails={chatUserDetails} />
                <hr className="my-4" />
              </>
            ) : (
              <>
                <Members chatUserDetails={chatUserDetails} />
                <hr className="my-4" />
              </>
            )}
            <Media media={chatUserDetails.media} limit={3} />
            <hr className="my-4" />
            <AttachedFiles attachedFiles={chatUserDetails.attachedFiles} />
          </AppSimpleBar> */}
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
      </div>
    </>
  );
};

export default Index;
