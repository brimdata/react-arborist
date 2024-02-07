interface ShortcutHandler {
  shortcut: (e:any) => boolean;
  function: (tree:any) => void;
}

export interface ShortcutHandlers {
  [key: string]: ShortcutHandler
}

export const shortcutHandlers = {
  handleDeleteNode: {
    shortcut: (e:any) => e.key === "Backspace",
    function: (tree:any, e:any) => {
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
    }
  },
  handleSelectDownTree: {
    shortcut: (e:any) => e.key === "ArrowUp",
    function: (tree:any, e:any) => {
      e.preventDefault();
      const prev = tree.prevNode;
      if (!e.shiftKey || tree.props.disableMultiSelection) {
        tree.focus(prev);
      } else {
        if (!prev) return;
        const current = tree.focusedNode;
        if (!current) {
          tree.focus(tree.lastNode); // ?
        } else if (current.isSelected) {
          tree.selectContiguous(prev);
        } else {
          tree.selectMulti(prev);
        }
      }
    }
  }
}
