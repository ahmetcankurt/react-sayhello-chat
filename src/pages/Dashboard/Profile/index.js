// components
import { memo } from "react";
import AppSimpleBar from "../../../components/AppSimpleBar";
import MyProfile from "./MyProfile";
import UserDescription from "./UserDescription";
import { useSelector } from "react-redux";

const Index = () => {
  const userInfo = useSelector((state) => state.userInformation.user);

  return (
    <div className="position-relative">
      <MyProfile userInfo={userInfo} />

      <AppSimpleBar className="p-3 profile-desc">
        <UserDescription userInfo={userInfo} />
      </AppSimpleBar>
    </div>
  );
};

export default memo(Index);