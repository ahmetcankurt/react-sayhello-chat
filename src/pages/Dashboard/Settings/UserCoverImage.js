import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label, UncontrolledTooltip } from "reactstrap";

import { updateUserImage } from "../../../redux/slices/userInformation";

import Swal from "sweetalert2";
import {API_URL} from "../../../config";

const UserCoverImage = ({ basicDetails }) => {
  const user = useSelector((state) => state.userInformation.user);
  const profileImageInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [image, setImage] = useState(
    basicDetails && basicDetails.coverImage
  );
  useEffect(() => {
    if (basicDetails && basicDetails.coverImage) {
      setImage(basicDetails.coverImage);
    }
  }, [basicDetails]);
  const onChangeProfileCover = (e) => {
    const files = [...e.target.files];
    if (files[0]) {
      const src = URL.createObjectURL(files[0]);
      setImage(src);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Dosya Boyutu Hatası",
        text: "Dosya boyutu 50 MB'den büyük olamaz.",
      });
      return;
    }

    const formData = new FormData();
    formData.append(type, file);

    dispatch(updateUserImage({ userId, formData, token }))
      .then(() => {
        Swal.fire({
          icon: "success",
          title: `${type === "profileImage" ? "Profil" : "Arka plan"} resmi başarıyla güncellendi.`,
          timer: 3000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Hata",
          text: `${type} güncellenirken bir hata oluştu.`,
        });
      });
  };

  return (
    <div className="user-profile-img">
      <img
        src={user?.backgroundImage && `${API_URL}/${user.backgroundImage}`}
        className="profile-img profile-foreground-img"
        style={{ height: "160px" }}
        alt="Profile Background"
      />
      <div className="overlay-content">
        <div>
          <div className="user-chat-nav p-3">
            <div className="d-flex w-100 align-items-center">
              <div className="flex-grow-1">
                <h5 className="text-white mb-0">Settings</h5>
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
                  Change Background
                </UncontrolledTooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCoverImage;
