import { CSSProperties } from "react";
import { TreeController } from "../controllers/tree-controller";

export function useCursorContainerStyle(tree: TreeController<any>) {
  return {
    height: tree.listHeight,
    width: "100%",
    position: "absolute",
    left: "0",
    top: "0",
  } as CSSProperties;
}
