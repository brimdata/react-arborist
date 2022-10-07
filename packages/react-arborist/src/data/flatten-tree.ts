import { NodeApi } from "../interfaces/node-api";
import { IdObj } from "../types/utils";

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

export function filterTree<T extends IdObj>(
  root: NodeApi<T>,
  isMatch: (n: NodeApi<T>) => boolean
): NodeApi<T>[] {
  function collect(node: NodeApi<T>) {
    let result: NodeApi<T>[] = [];
    const yes = !node.isRoot && isMatch(node);

    if (node.children) {
      for (let child of node.children) {
        result = result.concat(collect(child));
      }
    }
    if (result.length) {
      if (!node.isRoot) result.unshift(node);
      return result;
    }
    if (yes) return [node];
    else return [];
  }

  return collect(root).filter((n) => n.parent?.isOpen);
}
