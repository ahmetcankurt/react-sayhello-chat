import React, { memo } from "react";


const EmptyStateContacts = ({ searchedText }) => {
  return (
    <div className="rounded p-4 text-center">
      <i className="bx bx-info-circle fs-1 mb-3" />
      <div>Sonuç bulunamadı. "{searchedText}".</div>
    </div>
  );
};

export default memo(EmptyStateContacts)
