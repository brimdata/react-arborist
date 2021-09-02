import { Node, NodeModel } from "./types";

export function bound(n: number, min: number, max: number) {
  return Math.max(Math.min(n, max), min);
}

export const isFolder = (node: Node<any>) => !!node.children;

export const isHiddenRoot = (node: Node) => node.id === "HIDDEN";
/**
 * Is first param a decendent of the second param
 */
export const isDecendent = (a: Node, b: Node) => {
  let n: Node | null = a;
  while (n) {
    if (n.id === b.id) return true;
    n = n.parent;
  }
  return false;
};

export const indexOf = (node: Node) => {
  if (!node.parent) throw Error("Node does not have a parent");
  return node.parent.children!.findIndex((c) => c.id === node.id);
};

export function enrichTree(model: NodeModel): Node {
  function visitSelfAndChildren(
    m: NodeModel,
    level: number,
    parent: Node | null
  ) {
    const n = createNode(m, level, parent, null);
    if (m.children) {
      n.children = m.children.map((child) =>
        visitSelfAndChildren(child, level + 1, n)
      );
    }
    return n;
  }
  return visitSelfAndChildren(model, -1, null);
}

export function flattenTree(root: Node): Node[] {
  const list: Node[] = [];
  let index = 0;
  function collect(node: Node) {
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

export function createNode(
  model: NodeModel,
  level: number,
  parent: Node | null,
  children: Node[] | null
): Node {
  return {
    id: model.id,
    level,
    parent,
    children,
    isOpen: !!model.isOpen,
    model,
    rowIndex: null,
  };
}

export function noop() {}
