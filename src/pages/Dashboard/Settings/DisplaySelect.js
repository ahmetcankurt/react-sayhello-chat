import React from "react";

// constants
import { DisplayTypes} from "../../../constants/index";

const DisplaySelect = ({ value, onChange, label }) => {
  const onChangeSelect = (value) => {
    onChange(value);
  };
  return (
    <div className="d-flex align-items-center">
      <div className="flex-grow-1 overflow-hidden">
        <h5 className="font-size-13 mb-0 text-truncate">{label}</h5>
      </div>
      <div className="flex-shrink-0 ms-2">
        <select
          value={value}
          className="form-select form-select-sm"
          onChange={(e) => {
            onChangeSelect(e.target.value);
          }}
        >
          {(DisplayTypes || []).map((option, key) => (
            <option key={key} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DisplaySelect;
