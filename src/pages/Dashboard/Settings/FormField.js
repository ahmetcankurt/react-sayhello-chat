import React, { memo } from "react";

const FormField = ({ field, value, onChange }) => {
  const { label, name, type, required } = field;
  const id = `field-${name}`;

  return (
    <div className="mb-1">
      <label className="form-label" htmlFor={id}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          className="form-control form-container-textarea"
          name={name}
          id={id}
          value={value || ""}
          onChange={onChange}
          style={{ height: "100px" }}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          className="form-control"
          autoComplete="off"
          name={name}
          value={type === "date" && value ? value.split("T")[0] : value || ""}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
};

export default memo(FormField)
