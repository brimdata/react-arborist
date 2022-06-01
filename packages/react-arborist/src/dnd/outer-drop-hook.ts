import { useDrop } from "react-dnd";
import { useTreeApi } from "../context";
import { DragItem } from "../types";
import { computeDrop } from "./compute-drop";
import { DropResult } from "./drop-hook";

export function useOuterDrop() {
  const tree = useTreeApi();

  // In case we drop an item at the bottom of the list
  const [, drop] = useDrop<DragItem, DropResult | null, { isOver: boolean }>(
    () => ({
      accept: "NODE",
      hover: (item, m) => {
        if (!m.isOver({ shallow: true })) return;
        const offset = m.getClientOffset();
        if (!tree.listEl.current || !offset) return;
        const { cursor } = computeDrop({
          element: tree.listEl.current,
          offset: offset,
          indent: tree.indent,
          node: null,
          prevNode: tree.visibleNodes[tree.visibleNodes.length - 1],
          nextNode: null,
        });
        if (cursor) tree.showCursor(cursor);
      },
      canDrop: (item, m) => {
        return m.isOver({ shallow: true });
      },
      drop: (item, m) => {
        if (m.didDrop()) return;
        const offset = m.getClientOffset();
        if (!tree.listEl.current || !offset) return;
        const { drop } = computeDrop({
          element: tree.listEl.current,
          offset: offset,
          indent: tree.indent,
          node: null,
          prevNode: tree.visibleNodes[tree.visibleNodes.length - 1],
          nextNode: null,
        });
        return drop;
      },
    }),
    [tree]
  );

  drop(tree.listEl);
}
