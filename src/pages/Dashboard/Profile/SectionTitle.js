import React, { memo } from "react";

const SectionTitle = ({ title, className }) => {
  return (
    <div>
      <h5 className="font-size-11 text-muted text-uppercase mb-3">{title}</h5>
    </div>
  );
};

export default memo(SectionTitle);
