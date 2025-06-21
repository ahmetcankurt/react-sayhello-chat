import React, { memo } from "react";
import InfoItem from "./InfoItem";
import SocialLinks from "./SocialLinks";

const UserDescription = ({ userInfo }) => {
  const { aboutme, email, phone, socials, birthday } = userInfo || {};

  return (
    <div>
      {aboutme && (
        <div className="text-muted ">
          <p className="mb-1">{aboutme || ""}</p>
        </div>
      )}

      {birthday && (
        <div className="py-2  d-flex align-items-center">
          <i className="bx bx-cake me-3 fs-4 text-muted"></i>
          <span>{birthday}</span>
        </div>
      )}


      {email && (
        <InfoItem iconClass="bx bx-message-rounded-dots" href={`mailto:${email}`}>
          {email}
        </InfoItem>
      )}
      {phone && (
        <InfoItem iconClass="bx bx-phone" href={`tel:${phone}`}>
          {phone}
        </InfoItem>
      )}
      <SocialLinks socials={socials} />
    </div>
  );
};

export default memo(UserDescription);