import { TreeController } from "../controllers/tree-controller";
import { focusNextElement, focusPrevElement } from "../utils";

export function focusNext(tree: TreeController<any>) {
  const next = tree.nextNode || tree.firstNode;
  if (next) tree.focus(next.id);
}

export function focusPrev(tree: TreeController<any>) {
  const prev = tree.prevNode || tree.lastNode;
  if (prev) tree.focus(prev.id);
}

export function focusParent(tree: TreeController<any>) {
  const parentId = tree.focusedNode?.parentId;
  if (parentId) tree.focus(parentId);
}

export function close(tree: TreeController<any>) {
  tree.focusedNode?.close();
}

export function open(tree: TreeController<any>) {
  tree.focusedNode?.open();
}

export function focusOutsideNext(tree: TreeController<any>) {
  focusNextElement(tree.element);
}

export function focusOutsidePrev() {
  focusPrevElement(tree.element);
}
