import React, { memo } from "react";

import { Input } from "reactstrap";


const InputSection = ({ value, onChange, disabled, placeholder }) => {
  return (
    <div className="position-relative">
      <Input
        type="text"
        className="form-control form-control-lg chat-input"
        id="chat-input"
        placeholder={placeholder || "Type your message..."}
        value={value || ""}
        onChange={onChange}
        autoComplete="off"
        disabled={disabled} // Buraya eklendi
      />
    </div>
  );
};
export default memo(InputSection);
