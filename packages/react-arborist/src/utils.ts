import memoizeOne from "memoize-one";
import { flattenTree } from "./data/flatten-tree";
import { NodeApi } from "./interfaces/node-api";
import { IdObj } from "./types/utils";

export function bound(n: number, min: number, max: number) {
  return Math.max(Math.min(n, max), min);
}

export const isFolder = (node: NodeApi<any>) => !!node.children;

export function isItem(node: NodeApi<any> | null) {
  return node && !isFolder(node);
}

export function isClosed(node: NodeApi<any> | null) {
  return node && isFolder(node) && !node.isOpen;
}

/**
 * Is first param a decendent of the second param
 */
export const isDecendent = (a: NodeApi<any>, b: NodeApi<any>) => {
  let n: NodeApi<any> | null = a;
  while (n) {
    if (n.id === b.id) return true;
    n = n.parent;
  }
  return false;
};

export const indexOf = (node: NodeApi<any>) => {
  if (!node.parent) throw Error("Node does not have a parent");
  return node.parent.children!.findIndex((c) => c.id === node.id);
};

export function noop() {}

export const getIds = memoizeOne((nodes: NodeApi<any>[]) =>
  nodes.map((n) => n.id)
);

export const createIndex = memoizeOne(
  <T extends IdObj>(nodes: NodeApi<T>[]) => {
    return nodes.reduce<{ [id: string]: number }>((map, node, index) => {
      map[node.id] = index;
      return map;
    }, {});
  }
);

export const createList = memoizeOne(flattenTree);

export function dfs(node: NodeApi<any>, id: string): NodeApi<any> | null {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.children) {
    for (let child of node.children) {
      const result = dfs(child, id);
      if (result) return result;
    }
  }
  return null;
}

export function focusNextElement(target: HTMLElement) {
  const elements = getFocusable(target);

  let next: HTMLElement;
  for (let i = 0; i < elements.length; ++i) {
    const item = elements[i];
    if (item === target) {
      next = nextItem(elements, i);
      break;
    }
  }

  // @ts-ignore ??
  next?.focus();
}

export function focusPrevElement(target: HTMLElement) {
  const elements = getFocusable(target);
  let next: HTMLElement;
  for (let i = 0; i < elements.length; ++i) {
    const item = elements[i];
    if (item === target) {
      next = prevItem(elements, i);
      break;
    }
  }
  // @ts-ignore
  next?.focus();
}

function nextItem(list: HTMLElement[], index: number) {
  if (index + 1 < list.length) {
    return list[index + 1] as HTMLElement;
  } else {
    return list[0] as HTMLElement;
  }
}

function prevItem(list: HTMLElement[], index: number) {
  if (index - 1 >= 0) {
    return list[index - 1];
  } else {
    return list[list.length - 1];
  }
}

function getFocusable(target: HTMLElement) {
  return Array.from(
    document.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)'
    )
  ).filter((e) => e === target || !target.contains(e)) as HTMLElement[];
}

export function access<T = boolean>(
  obj: any,
  accessor: string | boolean | Function
): T {
  if (typeof accessor === "boolean") return accessor as unknown as T;
  if (typeof accessor === "string") return obj[accessor] as T;
  return accessor(obj) as T;
}

export function identifyNull(obj: string | IdObj | null) {
  if (obj === null) return null;
  else return identify(obj);
}

export function identify(obj: string | IdObj) {
  return typeof obj === "string" ? obj : obj.id;
}
