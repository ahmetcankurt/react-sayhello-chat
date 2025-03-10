import React, { memo, useState } from 'react';

const CustomTooltip = ({
  content,
  position = "top",
  color = "#fff",
  backgroundColor = "#000",
  width = "120px",
  height = "auto",
  borderRadius = "4px",
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const tooltipStyle = {
    position: "relative",
    display: "inline-block",
    cursor: "pointer",
    zIndex: 1000000,
  };

  const tooltipContentStyle = {
    visibility: isVisible ? "visible" : "hidden",
    backgroundColor: backgroundColor,
    color: color,
    textAlign: "center",
    padding: "8px",
    borderRadius: borderRadius,
    position: "absolute",
    zIndex: 100,
    width: width,
    height: height,
    opacity: isVisible ? 1 : 0,
    transition: "opacity 0.3s ease-in-out",
  };

  const arrowStyle = {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
  };

  const positionStyles = {
    top: {
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginBottom: "8px",
    },
    bottom: {
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginTop: "8px",
    },
    left: {
      right: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginRight: "8px",
    },
    right: {
      left: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginLeft: "8px",
    },
  };

  const arrowPositionStyles = {
    top: {
      borderWidth: "8px 8px 0 8px",
      borderColor: `${backgroundColor} transparent transparent transparent`,
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
    },
    bottom: {
      borderWidth: "0 8px 8px 8px",
      borderColor: `transparent transparent ${backgroundColor} transparent`,
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
    },
    left: {
      borderWidth: "8px 0 8px 8px",
      borderColor: `transparent transparent transparent ${backgroundColor}`,
      left: "100%",
      top: "50%",
      transform: "translateY(-50%)",
    },
    right: {
      borderWidth: "8px 8px 8px 0",
      borderColor: `transparent ${backgroundColor} transparent transparent`,
      right: "100%",
      top: "50%",
      transform: "translateY(-50%)",
    },
  };

  return (
    <div
      style={tooltipStyle}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className='tooltip-div'
    >
      {children}
      <div style={{ ...tooltipContentStyle, ...positionStyles[position] }}>
        {content}
        <div style={{ ...arrowStyle, ...arrowPositionStyles[position] }} />
      </div>
    </div>
  );
};

export default memo(CustomTooltip)