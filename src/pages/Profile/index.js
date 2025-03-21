import { memo, useEffect, useMemo } from "react";
import { Fancybox } from "@fancyapps/ui";
import ScrollContainer from "../../Component/ScrollContainer";
import { useSelector, shallowEqual } from "react-redux";
import { API_URL } from "../../config";
import Skeleton from "../../Component/Skeleton";
import { capitalize } from "../../utils/stringUtils";
import SocialLinks from "../../Component/SocialLinks";
import IconsList from "../../constants/profileSocialIcon";
import "./Profile.css";

const Index = () => {
  const userInfo = useSelector((state) => state.userInformation.user, shallowEqual);
  const Name = capitalize(userInfo.name);
  const Surname = capitalize(userInfo.surname);
  const icons = useMemo(() => IconsList(), []);

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      Toolbar: false, // Üst menüyü kapatır
      smallBtn: true, // Küçük kapatma butonu gösterir
    });

    return () => {
      Fancybox.unbind("[data-fancybox]");
    };
  }, []);

  if (!userInfo) {
    return <Skeleton width="100%" height="100vh" borderRadius="0" />;
  }

  return (
    <div>
      <div className="profile-container">
        {userInfo.backgroundImage ? (
          <a data-fancybox="Background" href={`${API_URL}/${userInfo.backgroundImage}`}>
            <img src={`${API_URL}/${userInfo.backgroundImage}`} className="profile-bg" alt="Profile Background" />
          </a>
        ) : (
          <Skeleton width="100%" height="200px" borderRadius="0" />
        )}

        {userInfo.profileImage ? (
          <a data-fancybox="profile" href={`${API_URL}/${userInfo.profileImage}`}>
            <img src={`${API_URL}/${userInfo.profileImage}`} className="profile-image" alt="Profile" />
          </a>
        ) : (
          <Skeleton
            className="profile-image"
            width={90}
            height={90}
            style={{ transform: "translate(-50%, -50%)", position: "absolute", bottom: "-50%", left: "50%" }}
            borderRadius={50}
          />
        )}
      </div>

      <p className="profile-name">
        {Name ?? <Skeleton className="profile-name mt-4" width="200px" height="20px" />}
        <span className="ms-2">{Surname}</span>
      </p>

      <span className="profile-job">
        {userInfo.jobs ?? <Skeleton className="profile-job" width="150px" height="20px" />}
      </span>

      <hr className="p-0 m-0 box-shadow-global" />

      <ScrollContainer paddingBottom="80px">
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
          <SocialLinks icons={icons} userInfo={userInfo} />
        )}
      </ScrollContainer>
    </div>
  );
};

export default memo(Index);
