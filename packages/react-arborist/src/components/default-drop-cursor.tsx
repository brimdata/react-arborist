import React, { CSSProperties } from "react";
import { DropCursorProps } from "../types";

const placeholderStyle = {
  display: "flex",
  alignItems: "center",
};

const lineStyle = {
  flex: 1,
  height: "2px",
  background: "#4B91E2",
  borderRadius: "1px",
};

const circleStyle = {
  width: "4px",
  height: "4px",
  boxShadow: "0 0 0 3px #4B91E2",
  borderRadius: "50%",
};

function DefaultCursor({ top, left, indent }: DropCursorProps) {
  const style: CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    top: top - 2 + "px",
    left: indent + left + "px",
    right: indent + "px",
  };
  return (
    <div style={{ ...placeholderStyle, ...style }}>
      <div style={{ ...circleStyle }}></div>
      <div style={{ ...lineStyle }}></div>
    </div>
  );
}

export function defaultDropCursor(props: DropCursorProps) {
  return <DefaultCursor {...props} />;
}
