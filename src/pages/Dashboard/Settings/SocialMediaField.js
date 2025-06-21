import { memo } from "react";

const SocialMediaField = ({ social, value, isPublic, onChange, onToggle }) => {
  const id = `switch-${social.name}`;

  return (
    <div className="mb-2">
      <div className="form-check form-switch d-flex align-items-center">
        <input
          className="form-check-input me-2"
          type="checkbox"
          role="switch"
          id={id}
          checked={isPublic}
          onChange={() => onToggle(social.name)}
        />
        <label className="form-check-label" htmlFor={id}>
          {social.label}
        </label>
      </div>
      <input
        type="text"
        className="form-control mt-1"
        name={social.name}
        value={value || ""}
        onChange={onChange}
        placeholder={`${social.label} linki girin`}
      />
    </div>
  );
};

export default memo(SocialMediaField)