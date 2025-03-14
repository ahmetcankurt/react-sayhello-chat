// Index.js
import { memo } from "react";
import Image from "./Image";
import Form from "./Form";

function Index() {

  return (
    <div>
      <Image />
      <Form />
    </div>
  );
}

export default memo(Index)