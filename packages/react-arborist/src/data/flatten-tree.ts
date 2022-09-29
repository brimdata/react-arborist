import { NodeApi } from "../interfaces/node-api";
import { IdObj } from "../types";

export function flattenTree<T extends IdObj>(root: NodeApi<T>): NodeApi<T>[] {
  const list: NodeApi<T>[] = [];
  let index = 0;
  function collect(node: NodeApi<T>) {
    if (node.level >= 0) {
      node.rowIndex = index++;
      list.push(node);
    }
    if (node.isOpen) {
      node.children?.forEach(collect);
    }
  }
  collect(root);
  return list;
}
