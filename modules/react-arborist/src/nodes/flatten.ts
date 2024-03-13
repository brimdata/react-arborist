import { TreeApi } from "../interfaces/tree-api";
import { NodeStruct } from "./node-struct";

export type RowStruct<T> = {
  node: NodeStruct<T>;
  index: number;
};

export function flatten<T>(tree: TreeApi<T>): RowStruct<T>[] {
  const list: RowStruct<T>[] = [];
  const queue = [...tree.root.children!];
  let node = queue.shift();
  let index = 0;
  while (node) {
    list.push({
      node,
      index: index++,
    });
    if (!node.isLeaf && tree.isOpen(node.id)) {
      queue.unshift(...node.children!);
    }
    node = queue.shift();
  }
  return list;
}
