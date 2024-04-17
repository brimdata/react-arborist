import { HTMLAttributes } from "react";
import { TreeController } from "../controllers/tree-controller.js";

export function createTreeViewAttributes(tree: TreeController<any>) {
  return {
    role: "tree",
    tabIndex: 0,
    dir: "rtl",
    style: {
      inlineSize: tree.width,
      blockSize: tree.height,
      minInlineSize: 0,
      minBlockSize: 0,
    },
    onKeyDown(e) {
      tree.handleKeyDown(e);
    },
    onFocus(e) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        tree.onFocus();
      }
    },
    onBlur(e) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        tree.onBlur();
      }
    },
  } as HTMLAttributes<HTMLDivElement>;
}
