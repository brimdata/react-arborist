import { RefObject } from "react";
import { ConnectDropTarget, useDrop } from "react-dnd";
import { DragItem } from "../types/dnd";
import { computeDrop } from "./compute-drop";
import { NodeController } from "../controllers/node-controller";

export type DropResult = {
  parentId: string | null;
  index: number | null;
};

export function useDropHook(
  el: RefObject<HTMLElement | null>,
  node: NodeController<any>,
): ConnectDropTarget {
  const tree = node.tree;
  const [_, dropRef] = useDrop<DragItem, DropResult | null, void>(
    () => ({
      accept: "NODE",
      canDrop: () => tree.canDrop(),
      hover: (_item, m) => {
        const offset = m.getClientOffset();
        if (!el.current || !offset) return;
        const rect = el.current.getBoundingClientRect();
        const x = offset.x - Math.round(rect.x);
        const y = offset.y - Math.round(rect.y);
        const { cursor, drop } = computeDrop({
          element: el.current,
          offset: { x, y },
          indent: tree.indent,
          node: node,
          prevNode: node.prev,
          nextNode: node.next,
        });
        if (drop) tree.draggingOver(drop.parentId, drop.index!);

        if (m.canDrop()) {
          if (cursor) tree.showCursor(cursor);
        } else {
          tree.hideCursor();
        }
      },
      drop: (_, m) => {
        if (!m.canDrop()) return null;
      },
    }),
    [node, el.current, tree.props],
  );

  return dropRef;
}
