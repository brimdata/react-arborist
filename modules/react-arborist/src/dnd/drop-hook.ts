import { RefObject } from "react";
import { ConnectDropTarget, useDrop } from "react-dnd";
import { useTreeApi } from "../context";
import { NodeApi } from "../interfaces/node-api";
import { DragItem } from "../types/dnd";
import { computeDrop } from "./compute-drop";
import { actions as dnd } from "../state/dnd-slice";
import { safeRun } from "../utils";
import { ROOT_ID } from "../data/create-root";

export type DropResult = {
  parentId: string | null;
  index: number | null;
};

export function useDropHook(
  el: RefObject<HTMLElement | null>,
  node: NodeApi<any>,
): ConnectDropTarget {
  const tree = useTreeApi();
  const [_, dropRef] = useDrop<DragItem, DropResult | null, void>(
    () => ({
      accept: "NODE",
      canDrop: () => tree.canDrop(),
      hover: (_item, m) => {
        const offset = m.getClientOffset();
        if (!el.current || !offset) return;
        const { cursor, drop } = computeDrop({
          element: el.current,
          offset: offset,
          indent: tree.indent,
          node: node,
          prevNode: node.prev,
          nextNode: node.next,
        });
        if (drop) tree.dispatch(dnd.hovering(drop.parentId, drop.index));

        if (m.canDrop()) {
          if (cursor) tree.showCursor(cursor);
        } else {
          tree.hideCursor();
        }
      },
      drop: (_, m) => {
        if (!m.canDrop()) return null;
        let { parentId, index, dragIds } = tree.state.dnd;
        safeRun(tree.props.onMove, {
          dragIds,
          parentId: parentId === ROOT_ID ? null : parentId,
          index: index === null ? 0 : index, // When it's null it was dropped over a folder
          dragNodes: tree.dragNodes,
          parentNode: tree.get(parentId),
        });
        tree.open(parentId);
      },
    }),
    [node, el.current, tree.props],
  );

  return dropRef;
}
