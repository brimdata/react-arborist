import { NodeApi } from "./interfaces/node-api";
import { TreeApi } from "./interfaces/tree-api";
import { IdObj } from "./types/utils";

export function bound(n: number, min: number, max: number) {
  return Math.max(Math.min(n, max), min);
}

export function isItem(node: NodeApi<any> | null) {
  return node && node.isLeaf;
}

export function isClosed(node: NodeApi<any> | null) {
  return node && node.isInternal && !node.isOpen;
}

export function isOpenWithEmptyChildren(node: NodeApi<any> | null) {
  return node && node.isOpen && !node.children?.length;
}

/**
 * Is first param a descendant of the second param
 */
export const isDescendant = (a: NodeApi<any>, b: NodeApi<any>) => {
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

export function walk(
  node: NodeApi<any>,
  fn: (node: NodeApi<any>) => void
): void {
  fn(node);
  if (node.children) {
    for (let child of node.children) {
      walk(child, fn);
    }
  }
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

export function mergeRefs(...refs: any) {
  return (instance: any) => {
    refs.forEach((ref: any) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref != null) {
        ref.current = instance;
      }
    });
  };
}

export function safeRun<T extends (...args: any[]) => any>(
  fn: T | undefined,
  ...args: Parameters<T>
) {
  if (fn) return fn(...args);
}

export function waitFor(fn: () => boolean) {
  return new Promise<void>((resolve, reject) => {
    let tries = 0;
    function check() {
      tries += 1;
      if (tries === 100) reject();
      if (fn()) resolve();
      else setTimeout(check, 10);
    }
    check();
  });
}

export function getInsertIndex(tree: TreeApi<any>) {
  const focus = tree.focusedNode;
  if (!focus) return tree.root.children?.length ?? 0;
  if (focus.isOpen) return 0;
  if (focus.parent) return focus.childIndex + 1;
  return 0;
}

export function getInsertParentId(tree: TreeApi<any>) {
  const focus = tree.focusedNode;
  if (!focus) return null;
  if (focus.isOpen) return focus.id;
  if (focus.parent && !focus.parent.isRoot) return focus.parent.id;
  return null;
}
