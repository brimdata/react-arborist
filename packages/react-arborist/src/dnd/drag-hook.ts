import { useEffect } from "react";
import { ConnectDragSource, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useTreeApi } from "../context";
import { NodeApi } from "../interfaces/node-api";
import { DragItem } from "../types/dnd";
import { IdObj } from "../types/utils";
import { DropResult } from "./drop-hook";
import { actions as dnd } from "../state/dnd-slice";

export function useDragHook<T extends IdObj>(
  node: NodeApi<T>
): ConnectDragSource {
  const tree = useTreeApi();
  const ids = tree.getSelectedIds();
  const [_, ref, preview] = useDrag<DragItem, DropResult, void>(
    () => ({
      canDrag: () => node.isDraggable,
      type: "NODE",
      item: () => ({
        id: node.id,
        dragIds: tree.isSelected(node.id) ? Array.from(ids) : [node.id],
      }),
      start: () => {
        tree.dispatch(dnd.dragStart(node.id));
      },
      end: (item, monitor) => {
        tree.dispatch(dnd.dragEnd());
        tree.hideCursor();
        const drop = monitor.getDropResult();
        // If they held down meta, we need to create a copy
        // if (drop.dropEffect === "copy")
        if (drop && drop.parentId) {
          tree.move({
            dragIds: item.dragIds,
            parentId: drop.parentId,
            index: drop.index,
          });
          tree.open(drop.parentId);
        }
      },
    }),
    [ids, node]
  );

  useEffect(() => {
    preview(getEmptyImage());
  }, [preview]);

  return ref;
}
