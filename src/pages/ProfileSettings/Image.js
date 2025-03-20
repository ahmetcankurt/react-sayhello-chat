import { memo, useRef } from "react";
import { TbCameraPlus } from "react-icons/tb";
import Swal from "sweetalert2";
import ProfileBg from "../../assets/image/image_header.jpg";
import "./ProfileSettings.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUserImage } from "../../redux/slices/userInformation";
import { API_URL } from "../../config";

function Image() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userInformation.user);

  const profileImageInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Resim güncelleme fonksiyonu
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
      <div className="profile-container">
        {/* Arka plan resmi */}
        <img
          src={user?.backgroundImage ? `${API_URL}/${user.backgroundImage}` : ProfileBg}
          className="profile-settings-bg"
          alt="Profile Background"
        />
        <input
          type="file"
          ref={backgroundImageInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e, "backgroundImage")}
        />
        <div className="camera-icon-bg">
          <TbCameraPlus className="icon" onClick={() => backgroundImageInputRef.current.click()} />
        </div>

        {/* Profil resmi */}
        <div className="profile-container">
          <img
            src={user?.profileImage ? `${API_URL}/${user.profileImage}` : ProfileBg}
            className="profile-settings-me"
            alt="Profile"
          />
          <div className="camera-icon-profil">
            <TbCameraPlus className="icon" onClick={() => profileImageInputRef.current.click()} />
          </div>
        </div>
        <input
          type="file"
          ref={profileImageInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e, "profileImage")}
        />
      </div>
  );
}

export default memo(Image);