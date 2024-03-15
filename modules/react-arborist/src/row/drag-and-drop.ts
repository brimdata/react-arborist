import { useRef, useCallback } from "react";
import { useDragHook } from "../dnd/drag-hook";
import { useDropHook } from "../dnd/drop-hook";
import { NodeController } from "../controllers/node-controller";

export function useRowDragAndDrop<T>(node: NodeController<T>) {
  const el = useRef<HTMLDivElement | null>(null);

  // @ts-ignore todo
  const dragRef = useDragHook<T>(node); // to do
  // @ts-ignore todo
  const dropRef = useDropHook(el, node); // to do
  const innerRef = useCallback(
    (n: any) => {
      el.current = n;
      dropRef(n);
    },
    [dropRef],
  );

  return { dragRef, innerRef };
}
