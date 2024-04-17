import { CSSProperties } from "react";
import { NodeController } from "../controllers/node-controller.js";
import { TreeController } from "../controllers/tree-controller.js";

export function createRowAttributes<T>(
  tree: TreeController<T>,
  node: NodeController<T>,
  style: CSSProperties,
): React.HTMLAttributes<any> {
  const top = parseFloat(style.top as string);
  const pad = tree.props.padding ?? tree.props.paddingTop ?? 0;

  return {
    role: "treeitem",
    "aria-level": node.level + 1,
    "aria-selected": node.isSelected,
    tabIndex: -1,
    className: tree.props.rowClassName,
    style: { ...style, top: top + pad },
  };
}
