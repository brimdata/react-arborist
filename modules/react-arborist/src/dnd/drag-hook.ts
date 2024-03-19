import { useEffect } from "react";
import { ConnectDragSource, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { DragItem } from "../types/dnd";
import { DropResult } from "./drop-hook";
import { NodeController } from "../controllers/node-controller";

export function useDragHook<T>(node: NodeController<T>): ConnectDragSource {
  const tree = node.tree;
  const ids = tree.selectedIds;
  const [_, ref, preview] = useDrag<DragItem, DropResult, void>(
    () => ({
      canDrag: () => node.isDraggable,
      type: "NODE",
      item: () => {
        // This is fired once at the begging of a drag operation
        tree.dragStart(node.id);
        console.log("item", node.id);
        return { id: node.id };
      },
      end: () => {
        if (tree.canDrop()) tree.drop();
        tree.dragEnd();
      },
    }),
    [ids, node],
  );

  useEffect(() => {
    preview(getEmptyImage());
  }, [preview]);

  return ref;
}
