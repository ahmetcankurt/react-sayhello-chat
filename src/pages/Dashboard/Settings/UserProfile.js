import React, { useEffect, useRef, useState } from "react";
import {
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import classnames from "classnames";


// CONSTANTS
import { STATUS_TYPES } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { updateUserImage } from "../../../redux/slices/userInformation";

import Swal from "sweetalert2";
import {API_URL} from "../../../config";

const UserProfile = () => {
  const profileImageInputRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userInformation.user);

  const fullName = user
    ? `${user.name} ${user.surname}`
    : "-";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);
  const [userStatus, setUserStatus] = useState(
    STATUS_TYPES.ACTIVE
  );
  const onChangeStatus = (status) => {
    setUserStatus(status);
  };
  useEffect(() => {
    setUserStatus(user.status);
  }, [user.status]);



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
    <div className="text-center p-3 p-lg-4 border-bottom pt-2 pt-lg-2 mt-n5 position-relative">
      <div className="mb-3 profile-user">
        <img
          src={user?.profileImage && `${API_URL}/${user.profileImage}`}
          className="rounded-circle avatar-lg img-thumbnail user-profile-image"
          alt="user-profile"
        />
        <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
          <input
            onChange={(e) => handleFileChange(e, "profileImage")}
            id="profile-img-file-input"
            ref={profileImageInputRef}
            type="file"
            className="profile-img-file-input"
            accept="image/png, image/jpeg"
          />
          <Label
            htmlFor="profile-img-file-input"
            className="profile-photo-edit avatar-xs"
          >
            <span className="avatar-title rounded-circle bg-light text-body">
              <i className="bx bxs-camera"></i>
            </span>
          </Label>
        </div>
      </div>

      <h5 className="font-size-16 mb-1 text-truncate">{fullName}</h5>

      {/* <Dropdown
        className="d-inline-block"
        isOpen={dropdownOpen}
        toggle={toggle}
      >
        <DropdownToggle tag="a" className="text-muted d-block" role="button">
          <i
            className={classnames(
              "bx",
              "bxs-circle",
              "font-size-10",
              "align-middle",
              { "text-success": userStatus === STATUS_TYPES.ACTIVE },
              { "text-warning": userStatus === STATUS_TYPES.AWAY },
              { "text-danger": userStatus === STATUS_TYPES.DO_NOT_DISTURB }
            )}
          ></i>{" "}
          {userStatus} <i className="mdi mdi-chevron-down"></i>
        </DropdownToggle>

        <DropdownMenu>
          <DropdownItem onClick={() => onChangeStatus(STATUS_TYPES.ACTIVE)}>
            <i className="bx bxs-circle text-success font-size-10 me-1 align-middle"></i>{" "}
            Active
          </DropdownItem>
          <DropdownItem onClick={() => onChangeStatus(STATUS_TYPES.AWAY)}>
            <i className="bx bxs-circle text-warning font-size-10 me-1 align-middle"></i>{" "}
            Away
          </DropdownItem>
          <DropdownItem
            onClick={() => onChangeStatus(STATUS_TYPES.DO_NOT_DISTURB)}
          >
            <i className="bx bxs-circle text-danger font-size-10 me-1 align-middle"></i>{" "}
            Do not disturb
          </DropdownItem>
        </DropdownMenu>
      </Dropdown> */}
    </div>
  );
};

export default UserProfile;
