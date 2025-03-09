// Index.js
import { memo, useState } from "react";
import Image from "./Image";
import Form from "./Form";

function Index() {

  return (
    <>
      <Image />
      <Form />
    </>
  );
}

export default memo(Index)