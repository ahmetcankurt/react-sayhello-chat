import { memo } from "react";
import ThemeColor from "./ThemeColor";
import ThemeImage from "./ThemeImage";

const ThemeSettings = ({ theme, onChangeData }) => {
  return (
    <div className="accordion-body">
      {/* <ThemeColor theme={theme} onChangeData={onChangeData} /> */}

      <ThemeImage theme={theme} onChangeData={onChangeData} />
    </div>
  );
};

export default memo(ThemeSettings)