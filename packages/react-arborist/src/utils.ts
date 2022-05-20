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

export function hasParent(node: Node | null) {
  return node && node.parent && node.parent.level >= 0;
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

export function withDefault(value: unknown, defaultValue: unknown) {
  if (value === undefined) return defaultValue;
  else return value;
}

export function first<T>(array: T[]) {
  return array[0];
}

export function last<T>(array: T[]) {
  return array[array.length - 1];
}
