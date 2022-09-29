import { RefObject } from "react";
import { ConnectDropTarget, useDrop } from "react-dnd";
import { useTreeApi } from "../context";
import { NodeApi } from "../interfaces/node-api";
import { DragItem } from "../types";
import { isDecendent, isFolder } from "../utils";
import { computeDrop } from "./compute-drop";

export type DropResult = {
  parentId: string | null;
  index: number;
};

export type CollectedProps = undefined;

export function useDropHook(
  el: RefObject<HTMLElement | null>,
  node: NodeApi<any>,
  prev: NodeApi<any> | null,
  next: NodeApi<any> | null
): [CollectedProps, ConnectDropTarget] {
  const tree = useTreeApi();
  return useDrop<DragItem, DropResult | null, CollectedProps>(
    () => ({
      accept: "NODE",
      canDrop: (item) => {
        for (let id of item.dragIds) {
          const drag = tree.get(id);
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
          if (cursor) tree.showCursor(cursor);
        } else {
          tree.hideCursor();
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
