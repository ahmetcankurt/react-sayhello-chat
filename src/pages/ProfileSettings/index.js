// Index.js
import { memo, useState } from "react";
import Image from "./Image";
import Form from "./Form";

function Index() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    aboutme: "",
    jobs: "",
    profileImage: "",
    backgroundImage: "",
  });

  return (
    <div>
      <Image userInfo={userInfo} setUserInfo={setUserInfo} />
      <Form userInfo={userInfo} setUserInfo={setUserInfo} />
    </div>
  );
}

export default memo(Index)
