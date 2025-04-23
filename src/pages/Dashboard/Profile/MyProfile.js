import React, { memo, useEffect, useState } from "react";
import { Fancybox } from "@fancyapps/ui";
import { API_URL } from "../../../config";

const MyProfile = ({ basicDetails }) => {
  const fullName = basicDetails
    ? `${basicDetails.name} ${basicDetails.surname}`
    : "-";
  const [bgImageError, setBgImageError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      Toolbar: false, // Üst menüyü kapatır
      smallBtn: true, // Küçük kapatma butonu gösterir
    });

    return () => {
      Fancybox.unbind("[data-fancybox]");
    };
  }, []);

  const handleBgImageError = () => {
    setBgImageError(true);
  };

  const handleProfileImageError = () => {
    setProfileImageError(true);
  };

  return (
    <>
      <div className="user-profile-img">
        {basicDetails && basicDetails.backgroundImage && !bgImageError ? (
          <a
            data-fancybox="Background"
            href={`${API_URL}/${basicDetails.backgroundImage}`}
          >
            <img
              src={`${API_URL}/${basicDetails.backgroundImage}`}
              className="profile-img"
              style={{ height: "160px" }}
              alt="Profile Background"
              onError={handleBgImageError}
            />
          </a>
        ) : (
          <div
            className="profile-img bg-light"
            style={{
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            <i className="fas fa-image fa-3x text-muted"></i>
          </div>
        )}

        <div className="overlay-content" style={{ pointerEvents: "none" }}>
          <div>
            <div className="user-chat-nav p-2 ps-3">
              <div className="d-flex w-100 align-items-center">
                <div className="flex-grow-1">
                  <h5 className="text-white mb-0 mt-2">Kullanıcı Profili</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center p-3 p-lg-4 border-bottom pt-2 pt-lg-2 mt-n5 position-relative">
        <div className="mb-lg-3 mb-2">
          {basicDetails && basicDetails.profileImage && !profileImageError ? (
            <a
              data-fancybox="Profile"
              href={`${API_URL}/${basicDetails.profileImage}`}
            >
              <img
                src={`${API_URL}/${basicDetails.profileImage}`}
                className="rounded-circle avatar-lg img-thumbnail"
                alt="Profile"
                onError={handleProfileImageError}
              />
            </a>
          ) : (
            <div
              className="rounded-circle avatar-lg img-thumbnail bg-light d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "#f5f5f5",
                margin: "0 auto",
              }}
            >
              <i className="fas fa-user fa-2x text-muted"></i>
            </div>
          )}
        </div>

        <h5 className="font-size-16 mb-1 text-truncate">{fullName}</h5>
        <p className="text-muted font-size-14 text-truncate mb-0">
          {basicDetails && basicDetails.jobs ? basicDetails.jobs : "-"}
        </p>
      </div>
    </>
  );
};
export default memo(MyProfile);