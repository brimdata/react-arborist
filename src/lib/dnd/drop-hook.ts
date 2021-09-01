import { RefObject } from "react";
import { ConnectDropTarget, useDrop } from "react-dnd";
import { useStaticContext } from "../context";
import { setCursorLocation } from "../reducer";
import { DragItem, Node } from "../types";
import { isDecendent, isFolder } from "../utils";
import { computeDrop } from "./compute-drop";

export type DropResult = {
  parentId: string | null;
  index: number;
};

export function useDropHook(
  el: RefObject<HTMLElement | null>,
  node: Node,
  prev: Node | null,
  next: Node | null
): ConnectDropTarget {
  const treeView = useStaticContext();
  const [, ref] = useDrop<DragItem, DropResult, { isOver: boolean }>(
    () => ({
      accept: "ITEM",
      canDrop: (item) => {
        for (let id of item.dragIds) {
          const drag = treeView.getNode(id);
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
            indent: treeView.indent,
            node: node,
            prevNode: prev,
            nextNode: next,
          });
          treeView.dispatch(setCursorLocation(cursor));
        } else {
          treeView.dispatch(setCursorLocation(null));
        }
      },
      drop: (item, m): DropResult | undefined => {
        const offset = m.getClientOffset();
        if (!el.current || !offset) return;
        const { parentId, index } = computeDrop({
          element: el.current,
          offset: offset,
          indent: treeView.indent,
          node: node,
          prevNode: prev,
          nextNode: next,
        });
        return { parentId, index };
      },
    }),
    [node, prev, el, treeView]
  );

  return ref;
}
