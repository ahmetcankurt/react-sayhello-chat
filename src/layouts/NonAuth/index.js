import { memo } from "react";

const Index = ({children}) => {
  return <div>{children}</div>
};

export default memo(Index)
