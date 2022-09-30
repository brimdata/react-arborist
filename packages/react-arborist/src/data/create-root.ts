import { IdObj } from "../types/utils";
import { NodeApi } from "../interfaces/node-api";
import { TreeApi } from "../interfaces/tree-api";

export const ROOT_ID = "__REACT_ARBORIST_INTERNAL_ROOT__";

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

  const root = new NodeApi<T>({
    tree,
    id: ROOT_ID,
    // @ts-ignore
    data: { id: ROOT_ID },
    level: -1,
    parent: null,
    children: null,
    isDraggable: true,
    isDroppable: true,
    rowIndex: null,
  });

  const data: T[] = Array.isArray(tree.props.data)
    ? tree.props.data
    : [tree.props.data];

  root.children = data.map((child) => {
    return visitSelfAndChildren(child, 0, root);
  });

  return root;
}
