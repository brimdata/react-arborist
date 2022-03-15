import { Node } from "./types";

export function bound(n: number, min: number, max: number) {
  return Math.max(Math.min(n, max), min);
}

export const isFolder = (node: Node<any>) => !!node.children;

export function isItem(node: Node | null) {
  return node && !isFolder(node);
}

export function isClosed(node: Node | null) {
  return node && isFolder(node) && !node.isOpen;
}

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
  // This should probably not throw an error, but instead return null
  if (!node.parent) throw Error("Node does not have a parent");
  return node.parent.children!.findIndex((c) => c.id === node.id);
};

export function noop() {}
