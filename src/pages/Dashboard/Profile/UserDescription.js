import React, { memo } from "react";
import InfoItem from "./InfoItem";
import { socialMediaLinks } from "./socialMediaLinks";

const UserDescription = ({ basicDetails }) => {
  const { aboutme, email, phone } = basicDetails || {};

  return (
    <div>
      <div className="text-muted mb-4">
        <p>{aboutme || "-"}</p>
      </div>

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

      {socialMediaLinks.map(({ name, icon, key }) =>
        basicDetails?.[key] ? (
          <InfoItem key={key} iconClass={icon} href={basicDetails[key]}>
            {name}
          </InfoItem>
        ) : null
      )}
    </div>
  );
};

export default memo(UserDescription);