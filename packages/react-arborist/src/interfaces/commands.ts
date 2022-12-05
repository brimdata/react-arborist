import { KeyboardEvent } from "react";
import { TreeApi } from "../interfaces/tree-api";
import { focusNextElement, focusPrevElement } from "../utils";

export type Command = <T extends any>(
  tree: TreeApi<T>,
  e?: KeyboardEvent<HTMLDivElement>
) => void;

const Delete: Command = (tree) => {
  if (!tree.props.onDelete) return;
  const ids = Array.from(tree.selectedIds);
  if (ids.length > 1) {
    let nextFocus = tree.mostRecentNode;
    while (nextFocus && nextFocus.isSelected) {
      nextFocus = nextFocus.nextSibling;
    }
    if (!nextFocus) nextFocus = tree.lastNode;
    tree.focus(nextFocus, { scroll: false });
    tree.delete(Array.from(ids));
  } else {
    const node = tree.focusedNode;
    if (node) {
      const sib = node.nextSibling;
      const parent = node.parent;
      tree.focus(sib || parent, { scroll: false });
      tree.delete(node);
    }
  }
};

const FocusOutsideNext: Command = (_, e) => {
  if (!e) throw Error(`Required keyboard event`);
  focusNextElement(e.currentTarget);
};

const FocusOutsidePrev: Command = (_, e) => {
  if (!e) throw Error(`Required keyboard event`);
  focusPrevElement(e.currentTarget);
};

const SelectAndActivate: Command = (tree) => {
  tree.select(tree.focusedNode);
  tree.activate(tree.focusedNode);
};

const FocusNext: Command = (tree) => {
  const next = tree.nextNode;
  tree.focus(next);
};

const FocusFirst: Command = (tree) => {
  tree.focus(tree.firstNode);
};

const FocusPrev: Command = (tree) => {
  tree.focus(tree.prevNode);
};

const Prev: Command = (tree) => {
  const prev = tree.prevNode;
  if (!prev) return;
  if (tree.props.disableMultiSelection) {
    tree.focus(prev);
    return;
  }
  const current = tree.focusedNode;
  if (!current) {
    tree.focus(tree.lastNode); // ?
  } else if (current.isSelected) {
    tree.selectContiguous(prev);
  } else {
    tree.selectMulti(prev);
  }
};

const FocusLast: Command = (tree) => {
  tree.focus(tree.lastNode);
};

const Next: Command = (tree) => {
  const next = tree.nextNode;
  if (tree.props.disableMultiSelection) {
    tree.focus(next);
    return;
  }

  const current = tree.focusedNode;
  if (!current) {
    tree.focus(tree.firstNode);
  } else if (current.isSelected) {
    tree.selectContiguous(next);
  } else {
    tree.selectMulti(next);
  }
};

const Right: Command = (tree) => {
  const node = tree.focusedNode;
  if (!node) return;
  if (node.isInternal && node.isOpen) {
    tree.focus(tree.nextNode);
  } else if (node.isInternal) {
    tree.open(node.id);
  }
};

const Left: Command = (tree) => {
  const node = tree.focusedNode;
  if (!node || node.isRoot) return;
  if (node.isInternal && node.isOpen) {
    tree.close(node.id);
  } else if (!node.parent?.isRoot) {
    tree.focus(node.parent);
  }
};

const SelectAll: Command = (tree) => {
  tree.selectAll();
};

const CreateLeaf: Command = (tree) => {
  if (!tree.props.onCreate) return;
  tree.createLeaf();
};

const CreateInternal: Command = (tree) => {
  if (!tree.props.onCreate) return;
  tree.createInternal();
};

const Rename: Command = (tree) => {
  if (!tree.props.onRename) return;
  setTimeout(() => {
    if (tree.focusedNode) tree.edit(tree.focusedNode);
  });
};

const SelectOrToggle: Command = (tree) => {
  const node = tree.focusedNode;
  if (!node) return;
  if (node.isLeaf) {
    node.select();
    node.activate();
  } else {
    node.toggle();
  }
};

const OpenSiblings: Command = (tree) => {
  const node = tree.focusedNode;
  if (!node) return;
  tree.openSiblings(node);
};

const PageUp: Command = (tree) => {
  tree.pageUp();
};

const PageDown: Command = (tree) => {
  tree.pageDown();
};

export const commands = {
  Delete,
  SelectAndActivate,
  FocusOutsideNext,
  FocusOutsidePrev,
  FocusNext,
  FocusPrev,
  FocusFirst,
  FocusLast,
  Next,
  Prev,
  Right,
  Left,
  SelectAll,
  CreateLeaf,
  CreateInternal,
  Rename,
  SelectOrToggle,
  OpenSiblings,
  PageUp,
  PageDown,
} as const;

export const SearchForNode = (() => {
  // variables for the closure
  let focusSearchTerm = "";
  let timeoutId: NodeJS.Timeout | null = null;

  return <T extends any>(
    tree: TreeApi<T>,
    e: KeyboardEvent<HTMLDivElement>
  ) => {
    // If they type a sequence of characters
    // collect them. Reset them after a timeout.
    // Use it to search the tree for a node, then focus it.
    // Clean this up a bit later
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    focusSearchTerm += e.key;
    timeoutId = setTimeout(() => {
      focusSearchTerm = "";
    }, 600);
    const node = tree.visibleNodes.find((n) => {
      // @ts-ignore
      const name = n.data.name;
      if (typeof name === "string") {
        return name.toLowerCase().startsWith(focusSearchTerm);
      } else return false;
    });
    if (node) tree.focus(node.id);
  };
})();
