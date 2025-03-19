import { memo, useMemo } from "react";
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
import { useSelector, shallowEqual } from "react-redux";
import { API_URL } from "../../config";
import Skeleton from "../../Component/Skeleton";

const Index = () => {
  const userInfo = useSelector((state) => state.userInformation.user, shallowEqual);

  const icons = useMemo(
    () => [
      { component: FaEnvelope, key: "email", valueKey: "email", label: "E-mail" },
      { component: FaInstagramSquare, key: "instagram", valueKey: "instagram", label: "Instagram" },
      { component: FaPhone, key: "phone", valueKey: "phone", label: "Phone" },
      { component: FaLinkedin, key: "linkedin", valueKey: "linkedin", label: "Linkedin" },
      { component: FaGithub, key: "github", valueKey: "github", label: "Github" },
      { component: FaTwitter, key: "twitter", valueKey: "twitter", label: "Twitter" },
    ],
    []
  );

  if (!userInfo) {
    return <Skeleton width="100%" height="100vh" borderRadius="0" />;
  }

  return (
    <div>
      <div className="profile-container">
        {userInfo.backgroundImage ? (
          <img src={`${API_URL}/${userInfo.backgroundImage}`} className="profile-bg" alt="Profile Background" />
        ) : (
          <Skeleton width="100%" height="200px" borderRadius="0" />
        )}

        {userInfo.profileImage ? (
          <img src={`${API_URL}/${userInfo.profileImage}`} className="profile-page" alt="Profile" />
        ) : (
          <Skeleton
            className="profile-page"
            width={90}
            height={90}
            style={{ transform: "translate(-50%, -50%)", position: "absolute", bottom: "-50%", left: "50%" }}
            borderRadius={50}
          />
        )}
      </div>

      <p className="profile-name">
        {userInfo.name ?? <Skeleton className="profile-name mt-4" width="200px" height="20px" />}
        <span className="ms-2">{userInfo.surname}</span>
      </p>

      <span className="profile-job">
        {userInfo.jobs ?? <Skeleton className="profile-job" width="150px" height="20px" />}
      </span>

      <hr className="p-0 m-0 box-shadow-global" />

      <ScrollContainer paddingBottom="80px" >
        <p className="profile-about py-3 px-2">
          {userInfo.aboutme ?? <Skeleton className="mt-2" width="80%" height="30px" />}
        </p>
        {!userInfo ? (
          <div className="gap">
            {icons.map(({ key }) => (
              <Skeleton className="mb-2" key={key} width="90%" height="20px" />
            ))}
          </div>
        ) : (
          icons.map(({ component: Icon, key, valueKey }) =>
            userInfo[valueKey] ? (
              <div key={key} className="icon-wrapper">
                <div className="d-flex align-items-center gap-2">
                  <Icon className="icon" />
                  <span>{userInfo[valueKey]}</span>
                </div>
              </div>
            ) : null
          )
        )}
      </ScrollContainer>
    </div>
  );
};

export default memo(Index);
