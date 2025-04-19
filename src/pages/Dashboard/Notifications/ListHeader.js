import { memo } from "react";

const ListHeader = () => {
  return (
    <div className="px-3 pt-4">
      <div className="d-flex align-items-start">
        <div className="flex-grow-1">
          <h4 className="mb-4">Bildirimler</h4>
        </div>
      </div>
    </div>
  );
};

export default memo(ListHeader)