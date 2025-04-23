// components
import AppSimpleBar from "../../../components/AppSimpleBar";
import MyProfile from "./MyProfile";
import UserDescription from "./UserDescription";
import { useDispatch, useSelector } from "react-redux";
import { memo, useEffect } from "react";
import { getUsers } from "../../../redux/slices/userInformation";

const Index = () => {
  const userInfo = useSelector((state) => state.userInformation.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);



  return (
    <div className="position-relative">
      {/* {getProfileLoading && !isProfileFetched && <Loader />} */}
      <MyProfile basicDetails={userInfo} />

      <AppSimpleBar className="p-3 profile-desc">
        <UserDescription basicDetails={userInfo} />
        {/* <hr className="my-4" /> */}

        {/* <Media media={profileDetails.media} limit={2} /> */}

        {/* <hr className="my-4" /> */}

        {/* <AttachedFiles attachedFiles={profileDetails.attachedFiles} /> */}
      </AppSimpleBar>
    </div>
  );
};

export default memo(Index);