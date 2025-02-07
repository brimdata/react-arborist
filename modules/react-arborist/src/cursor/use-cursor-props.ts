import { TreeController } from "../controllers/tree-controller.js";

export function useCursorProps(tree: TreeController<any>) {
  const cursor = tree.props.cursor.value;
  if (cursor && cursor.type === "line") {
    return {
      top: tree.rowHeight * cursor.index + tree.paddingTop,
      left: tree.indent * cursor.level,
      indent: tree.indent,
    };
  } else {
    return null;
  }
}
