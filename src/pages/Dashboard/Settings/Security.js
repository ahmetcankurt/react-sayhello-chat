import React, { useEffect, useState } from "react";

const Security = ({ security, onChangeSettings }) => {
  const [show, setShow] = useState(false);
  const onChange = (checked) => {
    setShow(checked);
    onChangeSettings("security", {
      ...security,
      securityNotification: checked,
    });
  };

  useEffect(() => {
    if (security) {
      setShow(security.securityNotification);
    }
  }, [security]);

  return (
    <div className="accordion-body">
      <ul className="list-group list-group-flush">
        <li className="list-group-item p-0">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h5 className="font-size-13 mb-0 text-truncate">
                Show security notification
              </h5>
            </div>
            <div className="flex-shrink-0 ms-2">
              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="security-notificationswitch"
                  checked={show === true}
                  onChange={(e) => {
                    onChange(e.target.checked);
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="security-notificationswitch"
                ></label>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Security;
