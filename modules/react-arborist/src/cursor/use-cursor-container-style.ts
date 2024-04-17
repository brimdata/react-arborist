import { CSSProperties } from "react";
import { TreeController } from "../controllers/tree-controller.js";

export function useCursorContainerStyle(tree: TreeController<any>) {
  return {
    height: tree.listHeight,
    width: "100%",
    position: "absolute",
    insetInlineStart: "0",
    insetBlockStart: "0",
  } as CSSProperties;
}
