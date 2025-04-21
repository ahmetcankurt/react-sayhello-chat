import React, { useEffect, useState } from "react";


// constants
import { DISPLAY_TYPES } from "../../../constants/index";

// components
import DisplaySelect from "./DisplaySelect";
const Privacy = ({ privacy, onChangeSettings }) => {
  const [data, setData] = useState({
    displayprofilePhoto: "selected",
    displayLastSeen: true,
    displayStatus: DISPLAY_TYPES.EVERYONE,
    readReceipts: true,
    displayGroups: DISPLAY_TYPES.EVERYONE,
  });
  useEffect(() => {
    if (privacy) {
      setData({
        displayprofilePhoto: privacy.displayprofilePhoto,
        displayLastSeen: privacy.displayLastSeen,
        displayStatus: privacy.displayStatus,
        readReceipts: privacy.readReceipts,
        displayGroups: privacy.displayGroups,
      });
    }
  }, [privacy]);

  const onChangeData = (
    field,
    value) => {
    let modifiedData = { ...data };
    modifiedData[field] = value;
    setData(modifiedData);
    onChangeSettings("privacy", modifiedData);
  };

  return (
    <div className="accordion-body">
      <ul className="list-group list-group-flush">
        <li className="list-group-item py-3 px-0 pt-0">
          <DisplaySelect
            value={data.displayprofilePhoto}
            label="Profile photo"
            onChange={(value) => {
              onChangeData("displayprofilePhoto", value);
            }}
          />
        </li>
        <li className="list-group-item py-3 px-0">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h5 className="font-size-13 mb-0 text-truncate">Last seen</h5>
            </div>
            <div className="flex-shrink-0 ms-2">
              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="privacy-lastseenSwitch"
                  checked={data.displayLastSeen === true}
                  onChange={(e) => {
                    onChangeData("displayLastSeen", e.target.checked);
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="privacy-lastseenSwitch"
                ></label>
              </div>
            </div>
          </div>
        </li>
        <li className="list-group-item py-3 px-0">
          <DisplaySelect
            value={data.displayStatus}
            onChange={(value) => {
              onChangeData("displayStatus", value);
            }}
            label="Status"
          />
          displayStatus
        </li>
        <li className="list-group-item py-3 px-0">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h5 className="font-size-13 mb-0 text-truncate">Read receipts</h5>
            </div>
            <div className="flex-shrink-0 ms-2">
              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="privacy-readreceiptSwitch"
                  checked={data.readReceipts === true}
                  onChange={(e) => {
                    onChangeData("readReceipts", e.target.checked);
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="privacy-readreceiptSwitch"
                ></label>
              </div>
            </div>
          </div>
        </li>
        <li className="list-group-item py-3 px-0 pb-0">
          <DisplaySelect
            value={data.displayGroups}
            onChange={(value) => {
              onChangeData("displayGroups", value);
            }}
            label="Groups"
          />
        </li>
      </ul>
    </div>
  );
};

export default Privacy;
