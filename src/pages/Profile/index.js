import { useState, useEffect, memo } from "react";
import ProfileBg from "../../assest/image/image_header.jpg";
import ImageMe from "../../assest/image/imageAdmin.jpeg";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaGithub,
  FaLinkedin,
  FaPhone,
} from "react-icons/fa";
import "./Profile.css";
import axios from "axios";

function Index() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token"); // Token'ı localStorage'dan alıyoruz
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (userId && token) {
      // Backend'e token ile istek gönderiyoruz
      axios
        .get("http://localhost:3000/users/my", {
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı Authorization başlığında gönderiyoruz
          },
        })
        .then((response) => {
          setUserInfo(response.data); // Gelen kullanıcı bilgilerini state'e kaydet
        })
        .catch((error) => {
          console.error("Kullanıcı bilgileri alınırken hata:", error);
        });
    }
  }, [userId, token]);

  if (!userInfo) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <div className="profile-container">
        <img
          src={`http://localhost:3000/${userInfo.backgroundImage}` || ProfileBg}
          className="profile-bg"
          alt="Profile Background"
        />
        <img src={`http://localhost:3000/${userInfo.profileImage}` || ImageMe} className="profile-page" alt="Profile" />
      </div>
      <div className="profile-main">
        <div className="mb-3">
          <p className="profile-name">
            {userInfo.name || "Name"} {userInfo.surname || "Surname"}
          </p>
          <span className="profile-job">{userInfo.jobs || "Jobs"}</span>
        </div>
        <div className="shadow-line" />
        <div>
          <p className="profile-about py-4">
            {userInfo.aboutme || "Hakkında Yazısı"}
          </p>
        </div>
        <div className="shadow-line" />
        <div className="profile-contact">
          <div className="contact-item">
            <FaEnvelope className="icon" />
            <span>{userInfo.email || "ahmetcankurt@gmail.com"}</span>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="icon" />
            <span>{userInfo.location || "İstanbul, Türkiye"}</span>
          </div>
          <div className="contact-item">
            <FaPhone className="icon" />
            <span>{userInfo.phone || "+90 555 123 4567"}</span>
          </div>
          <div className="contact-item">
            <FaLinkedin className="icon" />
            <a
              href={userInfo.linkedin || "https://linkedin.com/in/ahmetcankurt"}
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/ahmetcankurt
            </a>
          </div>
          <div className="contact-item">
            <FaGithub className="icon" />
            <a
              href={userInfo.github || "https://github.com/ahmetcankurt"}
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/ahmetcankurt
            </a>
          </div>
          <div className="contact-item">
            <FaBirthdayCake className="icon" />
            <span>{userInfo.birthdate || "1 Ocak 1990"}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(Index);
