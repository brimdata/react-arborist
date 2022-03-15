import { Node } from "../types";

export function flattenTree<T>(root: Node<T>): Node<T>[] {
  const list: Node<T>[] = [];
  let index = 0;
  function collect(node: Node<T>) {
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
