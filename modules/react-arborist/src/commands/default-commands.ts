import { TreeController } from "../controllers/tree-controller";
import { focusNextElement, focusPrevElement } from "../utils";

export type Tree = TreeController<any>;

export function focusFirst(tree: Tree) {
  if (tree.firstNode) tree.focus(tree.firstNode.id);
}

export function focusLast(tree: Tree) {
  if (tree.lastNode) tree.focus(tree.lastNode.id);
}

export function focusNext(tree: Tree) {
  const next = tree.nextNode || tree.firstNode;
  if (next) tree.focus(next.id);
}

export function focusPrev(tree: Tree) {
  const prev = tree.prevNode || tree.lastNode;
  if (prev) tree.focus(prev.id);
}

export function focusPrevPage(tree: Tree) {
  const start = tree.visibleStartIndex;
  const stop = tree.visibleStopIndex;
  const page = stop - start;
  let index = tree.focusedNode?.rowIndex ?? 0;
  if (index > start) {
    index = start;
  } else {
    index = Math.max(start - page, 0);
  }
  const node = tree.rows.at(index);
  if (node) tree.focus(node.id);
}

export function focusNextPage(tree: Tree) {
  const start = tree.visibleStartIndex;
  const stop = tree.visibleStopIndex;
  const page = stop - start;
  let index = tree.focusedNode?.rowIndex ?? 0;
  if (index < stop) {
    index = stop;
  } else {
    index = Math.min(index + page, tree.rows.length - 1);
  }
  const node = tree.rows.at(index);
  if (node) tree.focus(node.id);
}

export function focusParent(tree: Tree) {
  const parentId = tree.focusedNode?.parentId;
  if (parentId) tree.focus(parentId);
}

export function close(tree: Tree) {
  tree.focusedNode?.close();
}

export function open(tree: Tree) {
  tree.focusedNode?.open();
}

export function focusOutsideNext(tree: Tree) {
  if (tree.element) focusNextElement(tree.element);
}

export function focusOutsidePrev(tree: Tree) {
  if (tree.element) focusPrevElement(tree.element);
}
