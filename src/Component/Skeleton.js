import React, { memo } from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius, style }) => {
  return (
    <div
      className="skeleton"
      style={{
        width: width || '100%',
        height: height || '100%',
        borderRadius: borderRadius || '4px',
        ...style,
      }}
    />
  );
};

export default memo(Skeleton);
