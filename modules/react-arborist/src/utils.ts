import { NodeController } from "./controllers/node-controller.js";

export function bound(n: number, min: number, max: number) {
  return Math.max(Math.min(n, max), min);
}

export function isOpenWithEmptyChildren(node: NodeController<any> | null) {
  return node && node.isOpen && !node.object.children?.length;
}

export function noop() {}

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
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)',
    ),
  ).filter((e) => e === target || !target.contains(e)) as HTMLElement[];
}

export function toArray<T>(itemOrArray: T | T[]): T[] {
  if (Array.isArray(itemOrArray)) return itemOrArray;
  else return [itemOrArray];
}

export class Timer {
  id: number | undefined;

  cancel() {
    clearTimeout(this.id);
    this.id = undefined;
  }

  start(callback: () => void, delay: number) {
    this.id = setTimeout(() => {
      callback();
      this.id = undefined;
    }, delay) as unknown as number;
  }

  get hasStarted() {
    return this.id !== undefined;
  }
}
