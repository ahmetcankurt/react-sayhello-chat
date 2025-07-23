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
import DelayedImage from "../../../components/DelayedImage";
import GroupMembers from "./GroupMembers";
import { API_URL } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import AddMemberModal from "./AddMemberModal";
import EditGroupModal from "./EditGroupModal"
import { fetchUserData } from "../../../redux/slices/selectedUser";

const Index = ({ isProfileVisible, handleProfileClick, selectedUser }) => {
  const userInfo = useSelector(state => state.selectedUser.userInfo);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);


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


  const [imageErrorMap, setImageErrorMap] = useState({});
  const handleImageError = (userId) => {
    setImageErrorMap(prev => ({ ...prev, [userId]: true }));
  };

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // const currentUser = userInfo?.members?.find(m => m.role === "you");
  // const isCurrentUserAdmin = currentUser?.isAdmin === true;

  const members = userInfo?.members || [];
  const currentUser = members.find(m => m.role === "you");
  const isCurrentUserAdmin = currentUser?.isAdmin === true;

  const dispatch = useDispatch()

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
            selectedUser={selectedUser}
            onOpenVideo={onOpenVideo}
            onOpenAudio={onOpenAudio}
          />

          {selectedUser?.userType === "group" && isCurrentUserAdmin && (
            <div className="d-flex gap-2 p-3 pt-3 pb-0">
              <button
                className="btn btn-sm btn-primary cursor-pointer shadow-lg"
                onClick={() => setShowAddMemberModal(true)}
              >
                <i className="bx bx-user-plus me-1 "></i>
                Üye Ekle
              </button>
              <button
                className="btn btn-sm btn-secondary cursor-pointer shadow-sm"
                onClick={() => setShowEditGroupModal(true)}
              >
                <i className="bx bx-edit-alt me-1"></i>
                Düzenle
              </button>
            </div>
          )}


          {selectedUser?.userType === "group" && (
            <>
              <GroupMembers
                userInfo={userInfo}
                handleImageError={handleImageError}
                API_URL={API_URL}
                imageErrorMap={imageErrorMap}
              />

              <AddMemberModal
                isOpen={showAddMemberModal}
                toggle={() => setShowAddMemberModal(false)}
                groupId={userInfo?.groupId}
                userInfo={userInfo}
              />
            </>
          )}

          {showEditGroupModal && (
            <EditGroupModal
              isOpen={showEditGroupModal}
              toggle={() => setShowEditGroupModal(false)}
              groupData={userInfo} // <-- Doğru isimlendirme
              onUpdate={() => dispatch(fetchUserData({ id: userInfo.groupId, userType: "group" }))}

            />
          )}

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
