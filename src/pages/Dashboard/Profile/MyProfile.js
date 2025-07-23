import { memo, useEffect, useState } from "react";
import { Fancybox } from "@fancyapps/ui";
import { API_URL } from "../../../config";
import DelayedImage from "../../../components/DelayedImage";

const MyProfile = ({ userInfo }) => {
  const fullName = [userInfo?.name, userInfo?.surname].filter(Boolean).join(" ");
  const [bgImageError, setBgImageError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      Toolbar: false,
      smallBtn: true,
    });
    return () => Fancybox.unbind("[data-fancybox]");
  }, []);

  const handleError = (setter) => () => setter(true);

  const placeholderStyle = {
    height: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  };

  const avatarPlaceholderStyle = {
    ...placeholderStyle,
    margin: "0  auto",
    height: "75px",
    width: "75px",
    borderRadius: "50%",
  };

  return (
    <>
      <div className="user-profile-img">
        {userInfo?.backgroundImage && !bgImageError ? (
          <a data-fancybox="Background" href={`${API_URL}/${userInfo.backgroundImage}`}>
            <DelayedImage
              src={`${API_URL}/${userInfo.backgroundImage}`}
              className="profile-img"
              alt="Profile Background"
              onError={handleError(setBgImageError)}
              style={{ height: 160 }}
              fallback={
                <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center">
                  <i className="bx bx-user text-muted"></i>
                </div>
              }
            />
          </a>
        ) : (
          <div className="profile-img bg-light" style={placeholderStyle}>
            <i className="fas fa-image fa-3x text-muted"></i>
          </div>
        )}

        <div className="overlay-content" style={{ pointerEvents: "none" }}>
          <div className="user-chat-nav p-2 ps-3">
            <div className="d-flex w-100 align-items-center">
              <div className="flex-grow-1">
                <h5 className="text-white mb-0 mt-2 user-select-none">Kullanıcı Profili</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center p-3 p-lg-4 border-bottom pt-2 pt-lg-2 mt-n5 position-relative">
        <div className="mb-lg-3 mb-2">
          {userInfo?.profileImage && !profileImageError ? (
            <a data-fancybox="Profile" href={`${API_URL}/${userInfo.profileImage}`}>
              <DelayedImage
                src={`${API_URL}/${userInfo.profileImage}`}
                className="rounded-circle avatar-lg img-thumbnail user-select-none"
                alt="Profile"
                onError={handleError(setProfileImageError)}
                fallback={
                  <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bx bx-user text-muted"></i>
                  </div>
                }
              />
            </a>
          ) : (
            <div className="rounded-circle " style={avatarPlaceholderStyle}>
              <i className="fas fa-user fa-2x text-muted"></i>
            </div>
          )}
        </div>

        <h5 className="font-size-16 mb-1 text-truncate">{fullName}</h5>
        {userInfo?.jobs && (
          <p className="text-muted font-size-14 text-truncate mb-0">{userInfo.jobs}</p>
        )}
      </div>
    </>
  );
};

export default memo(MyProfile);