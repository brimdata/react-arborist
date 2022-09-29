import { NodeInterface } from "../node-interface";
import { IdObj } from "../types";

export function flattenTree<T extends IdObj>(
  root: NodeInterface<T>
): NodeInterface<T>[] {
  const list: NodeInterface<T>[] = [];
  let index = 0;
  function collect(node: NodeInterface<T>) {
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
