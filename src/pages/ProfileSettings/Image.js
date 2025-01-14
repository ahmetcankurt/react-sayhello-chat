// Image.js
import { memo, useRef } from "react";
import { TbCameraPlus } from "react-icons/tb";
import Swal from "sweetalert2";
import axios from "axios";
import ProfileBg from "../../assest/image/image_header.jpg";
import ImageMe from "../../assest/image/imageAdmin.jpeg";
import "./ProfileSettings.css";

function Image({ userInfo, setUserInfo }) {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const profileImageInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);

  // Resim güncelleme fonksiyonu
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Dosya Boyutu Hatası",
          text: "Dosya boyutu 50 MB'den büyük olamaz.",
        });
        return;
      }
  
      // Frontend görüntüleme için FileReader kullanmaya devam edebilirsiniz
      const reader = new FileReader();
      reader.onload = () => {
        setUserInfo((prev) => ({
          ...prev,
          [type]: reader.result,  // Frontend için base64 verisini kullan
        }));
      };
      reader.readAsDataURL(file);
  
      const formData = new FormData();
      formData.append(type, file);
  
      // API'ye resim dosyası gönderme işlemi
      axios
        .put(`http://localhost:3000/users/update-images/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // API yanıtını aldıktan sonra kullanıcı bilgilerini güncelle
          setUserInfo((prev) => ({
            ...prev,
            [type]: response.data[type],  // Backend'den gelen resim verisini kullan
          }));
  
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
          console.error(`${type} güncellenirken hata:`, error);
          Swal.fire({
            icon: "error",
            title: "Hata",
            text: `${type} güncellenirken bir hata oluştu.`,
          });
        });
    }
  };
  
  

  return (
    <div className="profile-settings-container">
      <div className="profile-container">
        {/* Arka plan resmi */}
        <img
          src={userInfo.backgroundImage ? `http://localhost:3000/${userInfo.backgroundImage}` : ProfileBg}
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
          <TbCameraPlus
            className="icon"
            onClick={() => backgroundImageInputRef.current.click()}
          />
        </div>

        {/* Profil resmi */}
        <div className="profile-container">
          <img
            src={userInfo.profileImage ? `http://localhost:3000/${userInfo.profileImage}` : ImageMe}
            className="profile-settings-me"
            alt="Profile"
          />
          <div className="camera-icon-profil">
            <TbCameraPlus
              className="icon"
              onClick={() => profileImageInputRef.current.click()}
            />
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
    </div>
  );
}

export default memo(Image) 
