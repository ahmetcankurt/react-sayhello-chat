import { memo } from "react";
import {
  FaEnvelope,
  FaInstagramSquare,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaTwitter,
} from "react-icons/fa";
import "./Profile.css";

import ScrollContainer from "../../Component/ScrollContainer";
import { useSelector } from "react-redux";
import { API_URL } from "../../config";

// Skeleton komponentinizi import edin
import Skeleton from "../../Component/Skeleton"; // yolunuzu güncelleyin

const icons = [
  { component: FaEnvelope, key: "email", valueKey: "email", label: "E-mail" },
  { component: FaInstagramSquare, key: "instagram", valueKey: "instagram", label: "Instagram" },
  { component: FaPhone, key: "phone", valueKey: "phone", label: "Phone" },
  { component: FaLinkedin, key: "linkedin", valueKey: "linkedin", label: "Linkedin" },
  { component: FaGithub, key: "github", valueKey: "github", label: "Github" },
  { component: FaTwitter, key: "twitter", valueKey: "twitter", label: "Twitter" },
];

function Index() {
  const userInfo = useSelector((state) => state.userInformation.user);

  if (!userInfo) {
    // Veri yüklenmediğinde Skeleton placeholder'lar gösteriliyor
    return (
    <Skeleton width="100%" height="100vh" borderRadius="0" />
    )
  }

  // Veriler yüklendiğinde normal içerik render ediliyor
  return (
    <>
      <div >
        <div className="profile-container">
          <img src={`${API_URL}/${userInfo.backgroundImage}`} className="profile-bg" alt="Profile Background" />
          <img src={`${API_URL}/${userInfo.profileImage}`} className="profile-page" alt="Profile" />
        </div>
        <p className="profile-name">
          {userInfo.name} {userInfo.surname}
        </p>
        <span className="profile-job">{userInfo.jobs}</span>
      </div>
      <hr className="p-0 m-0 box-shadow-global" />
      <ScrollContainer className="container-scroll">
        <p className="profile-about py-3 px-2">{userInfo.aboutme}</p>
        {icons.map(({ component: Icon, key, label }) => (
          <div key={key} className="icon-wrapper">
            <Icon className="icon" />
            {label}
          </div>
        ))}
      </ScrollContainer>
    </>
  );
}

export default memo(Index);
