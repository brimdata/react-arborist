import React, { CSSProperties } from "react";
import { useTreeApi } from "../context";

export function DropCursor() {
  const tree = useTreeApi();
  const cursor = tree.state.cursor;
  if (!cursor || cursor.type !== "line") return null;
  const top = tree.rowHeight * cursor.index;
  const left = tree.indent * cursor.level;
  const style: CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    top: top - 2 + "px",
    left: tree.indent + left + "px",
    right: tree.indent + "px",
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
