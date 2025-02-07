import React, { CSSProperties } from "react";
import { CursorRendererProps } from "../types/renderers.js";

const placeholderStyle = {
  display: "flex",
  alignItems: "center",
  zIndex: 1,
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

export const DefaultCursorRenderer = React.memo(function DefaultCursorRenderer({
  top,
  left,
  indent,
}: CursorRendererProps) {
  const style: CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    insetBlockStart: top - 2 + "px",
    insetInlineStart: left + "px",
    insetInlineEnd: indent + "px",
  };
  return (
    <div style={{ ...placeholderStyle, ...style }}>
      <div style={{ ...circleStyle }}></div>
      <div style={{ ...lineStyle }}></div>
    </div>
  );
});
