import { useDrop } from "react-aria";
import { NodeController } from "../controllers/node-controller";
import { computeDrop } from "./compute-drop";

export function useNodeDrop<T>(node: NodeController<T>, ref: any) {
  const { tree } = node;
  const { dropProps } = useDrop({
    ref,
    onDropMove(e) {
      // x, y is where the mouse position is relative
      // to the draggable element
      const { drop, cursor } = computeDrop({
        element: ref.current,
        offset: { x: e.x, y: e.y },
        indent: node.tree.indent,
        node: node,
        nextNode: node.next,
        prevNode: node.prev,
      });
      if (drop) node.tree.draggingOver(drop.parentId, drop.index!);

      if (node.tree.canDrop()) {
        if (cursor) node.tree.showCursor(cursor);
      } else {
        node.tree.hideCursor();
      }
    },
    onDrop() {
      if (tree.canDrop()) tree.drop();
    },
  });

  return dropProps;
}
