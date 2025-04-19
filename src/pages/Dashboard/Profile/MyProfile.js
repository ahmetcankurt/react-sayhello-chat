import React, { memo, useEffect } from "react";
import { Fancybox } from "@fancyapps/ui";
import {API_URL} from "../../../config";

const MyProfile = ({ basicDetails }) => {
  const fullName = basicDetails
    ? `${basicDetails.name} ${basicDetails.surname}`
    : "-";

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      Toolbar: false, // Üst menüyü kapatır
      smallBtn: true, // Küçük kapatma butonu gösterir
    });

    return () => {
      Fancybox.unbind("[data-fancybox]");
    };
  }, []);

  return (
    <>
      <div className="user-profile-img">
        {basicDetails && basicDetails.backgroundImage && (
          <a
            data-fancybox="Background"
            href={`${API_URL}/${basicDetails.backgroundImage}`}
          >
            <img
              src={`${API_URL}/${basicDetails.backgroundImage}`}
              className="profile-img"
              style={{ height: "160px" }}
              alt="Profile Background"
            />
          </a>
        )}

        <div className="overlay-content" style={{ pointerEvents: "none" }}>
          <div>
            <div className="user-chat-nav p-2 ps-3">
              <div className="d-flex w-100 align-items-center">
                <div className="flex-grow-1">
                  <h5 className="text-white mb-0 mt-2">My Profile</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center p-3 p-lg-4 border-bottom pt-2 pt-lg-2 mt-n5 position-relative">
        <div className="mb-lg-3 mb-2">
          {basicDetails && basicDetails.profileImage && (
            <a
              data-fancybox="Profile"
              href={`${API_URL}/${basicDetails.profileImage}`}
            >
              <img
                src={`${API_URL}/${basicDetails.profileImage}`}
                className="rounded-circle avatar-lg img-thumbnail"
                alt="Profile"
              />
            </a>
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