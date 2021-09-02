import React, { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useStaticContext } from "../context";
import { CursorLocation } from "../types";

type Props = {
  root: HTMLDivElement | null;
  cursor: CursorLocation | null;
};

export function DropCursor({ root, cursor }: Props) {
  const treeView = useStaticContext();
  if (!cursor || !root || cursor.index === null || cursor.level === null)
    return null;
  const top = treeView.rowHeight * cursor.index;
  const left = treeView.indent * cursor.level;
  const style: CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    top: top - 2 + "px",
    left: left + "px",
    right: treeView.indent + "px",
  };

  return createPortal(<DefaultCursor style={style} />, root);
}

const placeholderStyle = {
  display: "flex",
  alignItems: "center",
};

const lineStyle = {
  flex: 1,
  height: "2px",
  background: "#4B91E2",
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
