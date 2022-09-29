import { IdObj } from "../types";
import { NodeInterface } from "../node-interface";
import { TreeApi } from "../tree-api";

export function createRoot<T extends IdObj>(
  tree: TreeApi<T>
): NodeInterface<T> {
  function visitSelfAndChildren(
    data: T,
    level: number,
    parent: NodeInterface<T> | null
  ) {
    const node = new NodeInterface<T>({
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
