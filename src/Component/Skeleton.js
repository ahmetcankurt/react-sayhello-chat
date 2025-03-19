import React, { memo } from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius, style, className }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        className={`skeleton ${className}`}
        style={{
          textAlign: 'center',
          width: width || '100%',
          height: height || '100%',
          borderRadius: borderRadius || '4px',
          ...style,
        }}
      />
    </div>
  );
};

export default memo(Skeleton);