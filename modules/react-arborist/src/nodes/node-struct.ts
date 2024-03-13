import { Accessor } from "./accessor";

export type NodeStruct<T> = {
  id: string;
  data: T;
  children: NodeStruct<T>[] | null;
  parent: NodeStruct<T> | null;
  isLeaf: boolean;
  level: number;
};

export function createNodeStruct<T>(args: {
  data: T;
  level: number;
  parent: NodeStruct<T> | null;
  accessor: Accessor<T>;
}) {
  const { data, accessor, level, parent } = args;
  const id = accessor.getId(data);
  const isLeaf = accessor.getIsLeaf(data);
  const children = isLeaf ? null : accessor.getChildren(data);
  const node: NodeStruct<T> = {
    id,
    isLeaf,
    data,
    level,
    parent,
    children: null,
  };
  if (children) {
    node.children = children.map((child) =>
      createNodeStruct({
        data: child,
        parent: node,
        level: level + 1,
        accessor,
      }),
    );
  }
  return node;
}

export function find<T>(
  id: string,
  current?: NodeStruct<T>,
): NodeStruct<T> | null {
  if (!current) return null;
  if (current.id === id) return current;
  if (current.children) {
    for (let child of current.children) {
      const found = find(id, child);
      if (found) return found;
    }
    return null;
  }
  return null;
}
