import { memo } from "react";

const SocialLinks = ({ icons, userInfo }) => {
  return (
    <>
      {icons.map(({ component: Icon, key, valueKey }) =>
        userInfo[valueKey] ? (
          <div key={key} className="icon-wrapper">
            <div className="d-flex align-items-center gap-2">
              <a 
                href={
                  valueKey === 'email' 
                    ? `mailto:${userInfo[valueKey]}` 
                    : valueKey === 'phone' 
                    ? `tel:${userInfo[valueKey]}`  // Telefon için 'tel:' protokolü
                    : userInfo[valueKey]  // Diğer durumlar için URL
                } 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Icon className="icon" />
              </a>
              <a 
                href={
                  valueKey === 'email' 
                    ? `mailto:${userInfo[valueKey]}` 
                    : valueKey === 'phone' 
                    ? `tel:${userInfo[valueKey]}`  // Telefon için 'tel:' protokolü
                    : userInfo[valueKey]  // Diğer durumlar için URL
                } 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                {userInfo[valueKey]}
              </a>
            </div>
          </div>
        ) : null
      )}
    </>
  );
};

export default memo(SocialLinks);