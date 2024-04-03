import { useDrop } from "react-dnd";
import { DragItem } from "../types/dnd";
import { computeDrop } from "./compute-drop";
import { DropResult } from "./drop-hook";
import { useTree } from "../components/tree-view";
import { MutableRefObject } from "react";

export function useOuterDrop(listRef: MutableRefObject<any>) {
  const tree = useTree();

  // In case we drop an item at the bottom of the list
  const [, drop] = useDrop<DragItem, DropResult | null, { isOver: boolean }>(
    () => ({
      accept: "NODE",
      canDrop: (_item, m) => {
        if (!m.isOver({ shallow: true })) return false;
        return tree.canDrop();
      },
      hover: (_item, m) => {
        if (!m.isOver({ shallow: true })) return;
        const offset = m.getClientOffset();
        if (!listRef.current || !offset) return;
        const rect = listRef.current.getBoundingClientRect();
        const x = offset.x - Math.round(rect.x);
        const y = offset.y - Math.round(rect.y);
        const { cursor, drop } = computeDrop({
          element: listRef.current,
          offset: { x, y },
          indent: tree.indent,
          node: null,
          prevNode: tree.lastNode,
          nextNode: null,
        });
        if (drop) tree.draggingOver(drop.parentId, drop.index!);

        if (m.canDrop()) {
          if (cursor) tree.showCursor(cursor);
        } else {
          tree.hideCursor();
        }
      },
    }),
    [tree],
  );

  drop(listRef);
}
