import { IdObj } from "../types";
import { NodeApi } from "../interfaces/node-api";
import { TreeApi } from "../interfaces/tree-api";

export function createRoot<T extends IdObj>(tree: TreeApi<T>): NodeApi<T> {
  function visitSelfAndChildren(
    data: T,
    level: number,
    parent: NodeApi<T> | null
  ) {
    const node = new NodeApi<T>({
      tree,
      data,
      level,
      parent,
      id: data.id,
      children: null,
      isDraggable: tree.isDraggable(data),
      isDroppable: tree.isDroppable(data),
      rowIndex: null,
    });
    const children = tree.getChildren(data);
    if (children) {
      node.children = children.map((child: T) =>
        visitSelfAndChildren(child, level + 1, node)
      );
    }
    return node;
  }

  return visitSelfAndChildren(
    tree.props.data,
    tree.props.hideRoot ? -1 : 0,
    null
  );
}
