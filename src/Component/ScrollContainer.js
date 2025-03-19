import React, { memo, useEffect, useState, useRef, useCallback, forwardRef } from "react";
import "./ScrollContainer.css";
import useMobileMode from "../hooks/useMobileMode";

const ScrollContainer = forwardRef(({ children, className = "", style = {}, paddingBottom }, ref) => {
  const containerRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("100vh");

  const updateHeight = useCallback(() => {
    if (!containerRef.current) return;
    
    const windowHeight = window.innerHeight;
    const offsetTop = containerRef.current.getBoundingClientRect().top;
    const newHeight = `${windowHeight - offsetTop}px`;

    setMaxHeight((prevHeight) => (prevHeight !== newHeight ? newHeight : prevHeight));
  }, []);

  useEffect(() => {
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, [updateHeight]);

  const useMobile = useMobileMode();

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={`scroll-container ${className}`}
      style={{
        ...style, 
        maxHeight,
        paddingBottom: useMobile && paddingBottom ? paddingBottom : undefined,
      }}
    >
      {children}
    </div>
  );
});

export default memo(ScrollContainer);
