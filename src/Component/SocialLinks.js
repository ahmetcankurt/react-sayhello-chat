import { memo } from "react";

const SocialLinks = ({ icons, userInfo }) => {
  return (
    <>
      {icons.map(({ component: Icon, key, valueKey }) =>
        userInfo[valueKey] ? (
          <div key={key} className="icon-wrapper">
            <div className="d-flex align-items-center gap-2">
              <Icon className="icon" />
              <span className="social-link">{userInfo[valueKey]}</span>
            </div>
          </div>
        ) : null
      )}
    </>
  );
};

export default memo(SocialLinks)
