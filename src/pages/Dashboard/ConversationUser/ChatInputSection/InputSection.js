import React from "react";

import { Input } from "reactstrap";


const InputSection = ({ value, onChange }) => {
  // console.log("value",value)
  return (
    <div className="position-relative">
      <Input
        type="text"
        className="form-control form-control-lg chat-input"
        id="chat-input"
        placeholder="Type your message..."
        value={value || ""}
        onChange={onChange}
        autoComplete="off"
      />
    </div>
  );
};
export default InputSection;
