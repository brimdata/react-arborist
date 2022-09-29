import { useEffect } from "react";
import { ConnectDragSource, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useTreeApi } from "../context";
import { NodeApi } from "../interfaces/node-api";
import { DragItem, IdObj } from "../types";
import { DropResult } from "./drop-hook";

type CollectedProps = { isDragging: boolean };

export function useDragHook<T extends IdObj>(
  node: NodeApi<T>
): [{ isDragging: boolean }, ConnectDragSource] {
  const tree = useTreeApi();
  const ids = tree.getSelectedIds();
  const [{ isDragging }, ref, preview] = useDrag<
    DragItem,
    DropResult,
    CollectedProps
  >(
    () => ({
      canDrag: () => node.isDraggable,
      type: "NODE",
      item: () => ({
        id: node.id,
        dragIds: tree.isSelected(node.id) ? Array.from(ids) : [node.id],
      }),
      collect: (m) => ({
        isDragging: m.isDragging(),
      }),
      end: (item, monitor) => {
        tree.hideCursor();
        const drop = monitor.getDropResult();
        if (drop && drop.parentId) {
          tree.onMove(item.dragIds, drop.parentId, drop.index);
          tree.onToggle(drop.parentId, true);
        }
      },
    }),
    [ids, node]
  );

  useEffect(() => {
    preview(getEmptyImage());
  }, [preview]);

  return [{ isDragging }, ref];
}
