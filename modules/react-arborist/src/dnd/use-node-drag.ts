import { useDrag } from "react-aria";
import { NodeController } from "../controllers/node-controller.js";

export function useNodeDrag<T>(node: NodeController<T>) {
  const { tree } = node;
  const { dragProps } = useDrag({
    getItems() {
      return [{ nodeId: node.id }];
    },
    onDragStart(e) {
      tree.dragStart(node.id);
    },
    onDragMove(mouse) {
      const el = tree.element!.getBoundingClientRect();
      const withinY = mouse.y > el.y && mouse.y < el.y + el.height;
      const withinX = mouse.x > el.x && mouse.x < el.x + el.width;
      if (!(withinY && withinX)) tree.hideCursor();
    },
    onDragEnd(e) {
      tree.dragEnd();
    },
  });
  return dragProps;
}
