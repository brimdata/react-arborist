import { TreeController } from "../controllers/tree-controller";

export function focusNext(tree: TreeController<any>) {
  const next = tree.nextNode || tree.firstNode;
  if (next) tree.focus(next.id);
}

export function focusPrev(tree: TreeController<any>) {
  const prev = tree.prevNode || tree.lastNode;
  if (prev) tree.focus(prev.id);
}

export function close() {
  alert("close");
}

export function focusParent() {
  alert("focusParent");
}
