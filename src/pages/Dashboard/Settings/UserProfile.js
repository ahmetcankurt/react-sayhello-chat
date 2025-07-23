import { memo, useRef, useState } from "react";
import { Label } from "reactstrap";
import { useSelector } from "react-redux";
import { API_URL } from "../../../config";
import DelayedImage from "../../../components/DelayedImage";

const UserProfile = ({ handleFileChange, tempProfileImage }) => {
  const profileImageInputRef = useRef(null);
  const user = useSelector((state) => state.userInformation.user);
  const [imageError, setImageError] = useState(false);

  const fullName = user ? `${user.name} ${user.surname}` : "-";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="text-center p-3 p-lg-4 border-bottom pt-2 pt-lg-2 mt-n5 position-relative">
      <div className="mb-3 profile-user">
        {(tempProfileImage || (user?.profileImage && !imageError)) ? (
          <DelayedImage
            src={tempProfileImage || `${API_URL}/${user.profileImage}`}
            className="rounded-circle avatar-lg img-thumbnail user-profile-image"
            alt="user-profile"
            onError={handleImageError}
            fallback={
              <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center">
                <i className="bx bx-user text-muted"></i>
              </div>
            }
          />
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

        <div
          className="avatar-xs p-0 rounded-circle profile-photo-edit"
          id="change-profile"
        >
          <input
            onChange={(e) => handleFileChange(e, "profileImage")}
            id="profile-img-file-input"
            ref={profileImageInputRef}
            type="file"
            className="profile-img-file-input"
            accept="image/png, image/jpeg"
          />
          <Label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs">
            <span className="avatar-title border shadow-lg rounded-circle bg-light text-body">
              <i className="bx bxs-camera"></i>
            </span>
          </Label>
        </div>
      </div>
      <h5 className="font-size-16 mb-1 text-truncate">{fullName}</h5>
    </div>
  );
};

export default memo(UserProfile);