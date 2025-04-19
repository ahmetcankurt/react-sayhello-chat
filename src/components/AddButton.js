import React, { memo } from "react";

const AddButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-soft-primary btn-sm"
    >
      <i className="bx bx-plus"></i>
    </button>
  );
};

export default memo(AddButton);
