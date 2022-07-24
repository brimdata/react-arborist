import React, { CSSProperties } from "react";
import { DropCursorProps } from "react-arborist";

const lineStyle = {
  flex: 1,
  height: "4px",
  background: "orange",
  borderRadius: "1px",
};

const circleStyle = {
  width: "4px",
  height: "4px",
  boxShadow: "0 0 0 3px #4B91E2",
  borderRadius: "50%",
};

export function CustomCursor({ top, left, indent }: DropCursorProps) {
  const style: CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    top: top - 4 + "px",
    left: indent + left + "px",
    right: indent + "px",
    display: "flex",
    alignItems: "center",
  };
  return (
    <div style={{ ...style }}>
      <div style={{ ...circleStyle }}></div>
      <div style={{ ...lineStyle }}></div>
    </div>
  );
}
