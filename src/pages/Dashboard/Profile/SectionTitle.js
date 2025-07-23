import { memo } from "react";

const SectionTitle = ({ title}) => {
  return (
    <div>
      <h5 className="font-size-11 text-muted text-uppercase mb-3">{title}</h5>
    </div>
  );
};

export default memo(SectionTitle);