import { forwardRef } from "react";
import { useTreeApi } from "../context";
import { safeRun } from "../utils";
import { DropCursor } from "./cursor";

export const ListOuterElement = forwardRef(function Outer(
  props: React.HTMLProps<HTMLDivElement>,
  ref
) {
  const { children, ...rest } = props;
  const tree = useTreeApi();
  return (
    <div
      // @ts-ignore
      ref={ref}
      {...rest}
      onClick={(e) => safeRun(tree.props.onContextMenu, e)}
      onContextMenu={(e) => safeRun(tree.props.onContextMenu, e)}
    >
      <div
        style={{
          height: tree.visibleNodes.length * tree.rowHeight,
          width: "100%",
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
