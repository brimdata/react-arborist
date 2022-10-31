import { NodeApi } from "../interfaces/node-api";
import { TreeApi } from "../interfaces/tree-api";
import { IdObj } from "../types/utils";

export function createList<T>(tree: TreeApi<T>) {
  if (tree.isFiltered) {
    return flattenAndFilterTree(tree.root, tree.isMatch.bind(tree));
  } else {
    return flattenTree(tree.root);
  }
}

function flattenTree<T>(root: NodeApi<T>): NodeApi<T>[] {
  const list: NodeApi<T>[] = [];
  function collect(node: NodeApi<T>) {
    if (node.level >= 0) {
      list.push(node);
    }
    if (node.isOpen) {
      node.children?.forEach(collect);
    }
  }
  collect(root);
  list.forEach(assignRowIndex);
  return list;
}

function flattenAndFilterTree<T>(
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

  const list = collect(root).filter((n) => n.parent?.isOpen);
  list.forEach(assignRowIndex);
  return list;
}

function assignRowIndex(node: NodeApi<any>, index: number) {
  node.rowIndex = index;
}
