import { useDrop } from "react-aria";
import { computeDrop } from "./compute-drop.js";
import { TreeController } from "../controllers/tree-controller.js";

export function useTreeDrop<T>(tree: TreeController<T>, ref: any) {
  const { dropProps } = useDrop({
    ref,
    onDropMove(e) {
      const { cursor, drop } = computeDrop({
        element: ref.current,
        offset: { x: e.x, y: e.y },
        indent: tree.indent,
        node: null,
        prevNode: tree.lastNode,
        nextNode: null,
        direction: tree.props.direction,
      });
      if (drop) tree.draggingOver(drop.parentId, drop.index!);

      if (tree.canDrop()) {
        if (cursor) tree.showCursor(cursor);
      } else {
        tree.hideCursor();
      }
    },
    onDrop() {
      if (tree.canDrop()) tree.drop();
    },
  });

  return dropProps;
}
