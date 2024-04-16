import { NodeController } from "../controllers/node-controller.js";
import { TreeController } from "../controllers/tree-controller.js";
import { NodeType } from "../nodes/types.js";
import { focusNextElement, focusPrevElement } from "../utils.js";

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

export function destroy(tree: Tree) {
  if (confirm("Are you sure you want to delete?")) {
    if (tree.selectedIds.length) {
      tree.destroy(tree.selectedIds);
    } else if (tree.focusedNode) {
      tree.destroy([tree.focusedNode.id]);
    }
  }
}

function create(tree: Tree, nodeType: NodeType) {
  const node = tree.focusedNode;
  const parentId = getInsertParentId(node);
  const index = getInsertIndex(tree, node);
  const data = tree.props.nodes.initialize({ nodeType });
  tree.create({ parentId, index, data });
  tree.edit(data.id);
  tree.focus(data.id);
}

export function createLeaf(tree: Tree) {
  create(tree, "leaf");
}

export function createInternal(tree: Tree) {
  create(tree, "internal");
}

function getInsertParentId(focus: NodeController<any> | null) {
  if (!focus) return null;
  if (focus.isOpen) return focus.id;
  return focus.parentId;
}

function getInsertIndex(tree: Tree, focus: NodeController<any> | null) {
  if (!focus) return tree.props.nodes.value.length;
  if (focus.isOpen) return 0;
  return focus.childIndex + 1;
}

export function edit(tree: Tree) {
  const node = tree.focusedNode;
  if (node) tree.edit(node.id);
}

export function moveSelectionStart(tree: Tree) {
  const prev = tree.prevNode;
  if (prev) {
    tree.focus(prev.id);
    tree.selectContiguous(prev.id);
  }
}

export function moveSelectionEnd(tree: Tree) {
  const next = tree.nextNode;
  if (next) {
    tree.focus(next.id);
    tree.selectContiguous(next.id);
  }
}

export function select(tree: Tree) {
  const node = tree.focusedNode;
  if (node) tree.select(node.id);
}

export function selectAll(tree: Tree) {
  tree.selectAll();
}

export function toggle(tree: Tree) {
  const node = tree.focusedNode;
  if (node) {
    node.isOpen ? tree.close(node.id) : tree.open(node.id);
  }
}

export function openSiblings(tree: Tree) {
  const node = tree.focusedNode;
  if (!node) return;
  const parent = node.parent;
  if (!parent) return;

  for (let sibling of parent.object.children!) {
    if (!sibling.isLeaf) {
      node.isOpen ? tree.close(sibling.id) : tree.open(sibling.id);
    }
  }
  tree.scrollTo(node.rowIndex);
}
