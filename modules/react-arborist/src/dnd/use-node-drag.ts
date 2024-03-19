import { useDrag } from "react-aria";
import { NodeController } from "../controllers/node-controller";

export function useNodeDrag<T>(node: NodeController<T>) {
  const { tree } = node;
  const { dragProps } = useDrag({
    getItems() {
      return [{ nodeId: node.id }];
    },
    onDragStart(e) {
      tree.dragStart(node.id);
    },
    onDragEnd(e) {
      if (tree.canDrop()) tree.drop();
      tree.dragEnd();
    },
  });
  return dragProps;
}
