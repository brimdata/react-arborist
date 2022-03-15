import { RefObject } from "react";
import { ConnectDropTarget, useDrop } from "react-dnd";
import { useStaticContext } from "../context";
import { DragItem, Node } from "../types";
import { isDecendent, isFolder } from "../utils";
import { computeDrop } from "./compute-drop";

export type DropResult = {
  parentId: string | null;
  index: number;
};

export type CollectedProps = undefined;

export function useDropHook(
  el: RefObject<HTMLElement | null>,
  node: Node,
  prev: Node | null,
  next: Node | null
): [CollectedProps, ConnectDropTarget] {
  const tree = useStaticContext();
  return useDrop<DragItem, DropResult | null, CollectedProps>(
    () => ({
      accept: "NODE",
      canDrop: (item) => {
        for (let id of item.dragIds) {
          const drag = tree.api.getNode(id);
          if (!drag) return false;
          if (isFolder(drag) && isDecendent(node, drag)) return false;
        }
        return true;
      },
      hover: (item, m) => {
        if (m.canDrop()) {
          const offset = m.getClientOffset();
          if (!el.current || !offset) return;
          const { cursor } = computeDrop({
            element: el.current,
            offset: offset,
            indent: tree.indent,
            node: node,
            prevNode: prev,
            nextNode: next,
          });
          if (cursor) tree.api.showCursor(cursor);
        } else {
          tree.api.hideCursor();
        }
      },
      drop: (item, m): DropResult | undefined | null => {
        const offset = m.getClientOffset();
        if (!el.current || !offset) return;
        const { drop } = computeDrop({
          element: el.current,
          offset: offset,
          indent: tree.indent,
          node: node,
          prevNode: prev,
          nextNode: next,
        });
        return drop;
      },
    }),
    [node, prev, el, tree]
  );
}
