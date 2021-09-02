import { useEffect } from "react";
import { ConnectDragSource, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useIsSelected, useSelectedIds, useStaticContext } from "../context";
import { setCursorLocation } from "../reducer";
import { DragItem, Node } from "../types";
import { DropResult } from "./drop-hook";

type CollectedProps = { isDragging: boolean };

export function useDragHook(
  node: Node
): [{ isDragging: boolean }, ConnectDragSource] {
  const treeView = useStaticContext();
  const isSelected = useIsSelected();
  const ids = useSelectedIds();
  const [{ isDragging }, ref, preview] = useDrag<
    DragItem,
    DropResult,
    CollectedProps
  >(
    () => ({
      type: "NODE",
      item: () => ({
        id: node.id,
        dragIds: isSelected(node.rowIndex) ? ids : [node.id],
      }),
      collect: (m) => ({
        isDragging: m.isDragging(),
      }),
      end: (item, monitor) => {
        treeView.dispatch(setCursorLocation(null));
        const drop = monitor.getDropResult();
        if (drop && drop.parentId) {
          treeView.onMove(item.dragIds, drop.parentId, drop.index);
          treeView.onOpen(drop.parentId);
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
