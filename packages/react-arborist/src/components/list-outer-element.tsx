import { forwardRef } from "react";
import { useStaticContext } from "../context";
import { DropCursor } from "./drop-cursor";

export const ListOuterElement = forwardRef(function Outer(
  props: React.HTMLProps<HTMLDivElement>,
  ref
) {
  const { children, ...rest } = props;
  const tree = useStaticContext();
  return (
    <div
      // @ts-ignore
      ref={ref}
      {...rest}
      onClick={tree.onClick}
      onContextMenu={tree.onContextMenu}
    >
      <div
        style={{
          height: tree.api.visibleNodes.length * tree.rowHeight,
          width: "100%",
          overflow: "hidden",
          position: "absolute",
          left: "0",
          right: "0",
        }}
      >
        <DropCursor />
      </div>
      {children}
    </div>
  );
});
