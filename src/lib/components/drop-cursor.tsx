import React, { CSSProperties } from "react";
import { useCursorLocation, useStaticContext } from "../context";

export function DropCursor() {
  const treeView = useStaticContext();
  const cursor = useCursorLocation();
  if (!cursor || cursor.type !== "line") return null;
  const top = treeView.rowHeight * cursor.index;
  const left = treeView.indent * cursor.level;
  const style: CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    top: top - 2 + "px",
    left: treeView.indent + left + "px",
    right: treeView.indent + "px",
  };

  return <DefaultCursor style={style} />;
}

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

function DefaultCursor({ style }: { style: CSSProperties }) {
  return (
    <div style={{ ...placeholderStyle, ...style }}>
      <div style={{ ...circleStyle }}></div>
      <div style={{ ...lineStyle }}></div>
    </div>
  );
}
