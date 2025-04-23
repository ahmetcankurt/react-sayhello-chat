import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Label, UncontrolledTooltip } from "reactstrap";
import { API_URL } from "../../../config";

const UserCoverImage = ({ handleFileChange, tempBackgroundImage }) => {
  const user = useSelector((state) => state.userInformation.user);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="user-profile-img">
      {(tempBackgroundImage || (user?.backgroundImage && !imageError)) ? (
        <img
          src={tempBackgroundImage || `${API_URL}/${user.backgroundImage}`}
          className="profile-img profile-foreground-img"
          style={{ height: "160px" }}
          alt="Profile Background"
          onError={handleImageError}
        />
      ) : (
        <div
          className="profile-img profile-foreground-img bg-light d-flex align-items-center justify-content-center"
          style={{ height: "160px" }}
        >
          <i className="fas fa-image fa-3x text-muted"></i>
        </div>
      )}
      
      <div className="overlay-content">
        <div>
          <div className="user-chat-nav p-3">
            <div className="d-flex w-100 align-items-center">
              <div className="flex-grow-1">
                <h5 className="text-white mb-0">Ayarlar</h5>
              </div>
              <div className="flex-shrink-0">
                <div
                  className="avatar-xs p-0 rounded-circle profile-photo-edit"
                  id="change-cover"
                >
                  <input
                    id="profile-foreground-img-file-input"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="profile-foreground-img-file-input"
                    onChange={(e) => handleFileChange(e, "backgroundImage")}
                  />
                  <Label
                    htmlFor="profile-foreground-img-file-input"
                    className="profile-photo-edit avatar-xs"
                  >
                    <span className="avatar-title rounded-circle bg-light text-body">
                      <i className="bx bxs-pencil"></i>
                    </span>
                  </Label>
                </div>
                <UncontrolledTooltip target="change-cover" placement="bottom">
                  Kapak Resmini Değiştir
                </UncontrolledTooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(UserCoverImage);