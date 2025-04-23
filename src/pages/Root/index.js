import React, { memo } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  return (
    <Navigate to="/dashboard" />
  );
};

export default memo(Index)