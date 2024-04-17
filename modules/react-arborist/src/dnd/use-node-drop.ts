import { useDrop } from "react-aria";
import { NodeController } from "../controllers/node-controller.js";
import { ComputedDrop, computeDrop } from "./compute-drop.js";
import { useRef } from "react";
import { Timer } from "../utils.js";

export function useNodeDrop<T>(node: NodeController<T>, ref: any) {
  const { tree } = node;
  const timer = useRef(new Timer()).current;

  function openAfterDelay(id: string) {
    if (timer.hasStarted) return;
    timer.start(() => tree.open(id), 750);
  }

  const { dropProps } = useDrop({
    ref,
    onDropExit() {
      timer.cancel();
    },
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
        direction: tree.props.direction,
      });
      if (drop) {
        node.tree.draggingOver(drop.parentId, drop.index!);
        if (overFolder(drop)) {
          openAfterDelay(drop.parentId!);
        } else {
          timer.cancel();
        }
      }

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

function overFolder(drop: ComputedDrop["drop"]) {
  return drop && drop.parentId && drop.index === null;
}
