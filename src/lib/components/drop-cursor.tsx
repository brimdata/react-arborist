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
  if (!cursor || !root || !cursor.index) return null;
  const top = treeView.rowHeight * cursor.index;
  const left = treeView.indent * cursor.level + 20;
  const style: CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    top: top - 2 + "px",
    left: left + "px",
    right: treeView.indent + "px",
  };

  return createPortal(
    <div className="drop-placeholder" style={style}>
      <div className="placeholder-circle"></div>
      <div className="placeholder-line"></div>
    </div>,
    root
  );
}
