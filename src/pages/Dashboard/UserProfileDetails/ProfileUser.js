import { memo, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import imagePlaceholder from "../../../assets/images/users/user-dummy-img.jpg";
import { API_URL } from "../../../config";

const ProfileUser = ({
  userInfo,
  onOpenAudio,
  onOpenVideo,
  handleProfileClick,
  selectedUser
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);
  const [imageError, setImageError] = useState(false);

  const isGroup = selectedUser?.userType === "group";

  const rawImage = isGroup
    ? userInfo?.groupImage
    : userInfo?.profileImage;

  const profile = !rawImage || imageError
    ? imagePlaceholder
    : `${API_URL}/${rawImage}`;

  const fullName = [userInfo?.name, userInfo?.surname]
    .filter(Boolean)
    .join(" ");


  return (
    <div className="p-3 border-bottom ">
      <div className="user-profile-img ">
        <img
         className="profile-img rounded "
          alt="Profile"
          src={profile}
          onError={() => setImageError(true)}
        />
        <div className="overlay-content rounded">
          <div className="user-chat-nav p-2">
            <div className="d-flex w-100">
              <div className="flex-grow-1">
                <Button
                  color="none"
                  type="button"
                  className="btn nav-btn text-white user-profile-show d-none d-lg-block"
                  onClick={handleProfileClick}
                >
                  <i className="bx bx-x"></i>
                </Button>
                <Button
                  type="button"
                  color="none"
                  className="btn nav-btn text-white user-profile-show d-block d-lg-none"
                  onClick={handleProfileClick}
                >
                  <i className="bx bx-left-arrow-alt"></i>
                </Button>
              </div>
              <div className="flex-shrink-0">
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle
                    color="none"
                    className="btn nav-btn text-white"
                    type="button"
                  >
                    <i className="bx bx-dots-vertical-rounded"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem className="d-flex justify-content-between align-items-center d-lg-none user-profile-show">
                      View Profile <i className="bx bx-user text-muted"></i>
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex justify-content-between align-items-center d-lg-none"
                      onClick={onOpenAudio}
                    >
                      Audio <i className="bx bxs-phone-call text-muted"></i>
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex justify-content-between align-items-center d-lg-none"
                      onClick={onOpenVideo}
                    >
                      Video <i className="bx bx-video text-muted"></i>
                    </DropdownItem>
                    <DropdownItem className="d-flex justify-content-between align-items-center">
                      Archive <i className="bx bx-archive text-muted"></i>
                    </DropdownItem>
                    <DropdownItem className="d-flex justify-content-between align-items-center">
                      Muted <i className="bx bx-microphone-off text-muted"></i>
                    </DropdownItem>
                    <DropdownItem className="d-flex justify-content-between align-items-center">
                      Delete <i className="bx bx-trash text-muted"></i>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>

          <div className="mt-auto p-3">
            <h5 className="user-name mb-1 text-truncate user-select-none">
              {fullName}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProfileUser);