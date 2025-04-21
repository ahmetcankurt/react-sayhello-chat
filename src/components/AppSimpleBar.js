import React, { memo } from "react";

// simplebar
import SimpleBar from "simplebar-react";
// import "simplebar/dist/simplebar.min.css";

const AppSimpleBar = ({
  children,
  style,
  className,
  scrollRef,
}) => {
  return (
    <SimpleBar style={style} className={className} ref={scrollRef}>
      {children}
    </SimpleBar>
  );
};

export default memo(AppSimpleBar);
