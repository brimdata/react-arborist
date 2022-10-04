import { FixedSizeList } from "react-window";
import { useTreeApi } from "../context";
import { focusNextElement, focusPrevElement } from "../utils";
import { ListOuterElement } from "./list-outer-element";
import { RowContainer } from "./row-container";

let focusSearchTerm = "";
let timeoutId: any = null;

export function DefaultContainer() {
  const tree = useTreeApi();
  return (
    <div
      style={{ height: tree.height, width: tree.width }}
      tabIndex={1}
      onFocus={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          tree.onFocus();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          tree.onBlur();
        }
      }}
      onKeyDown={(e) => {
        if (tree.isEditing) return;
        if (e.key === "Backspace") {
          const node = tree.focusedNode;
          if (node) {
            const sib = node.nextSibling;
            const parent = node.parent;
            tree.focus(sib || parent, { scroll: false });
            tree.delete(node);
          }
        }
        if (e.key === "Tab" && !e.shiftKey) {
          e.preventDefault();
          focusNextElement(e.currentTarget);
        }
        if (e.key === "Tab" && e.shiftKey) {
          e.preventDefault();
          focusPrevElement(e.currentTarget);
        }
        if (e.key === "ArrowDown" && !e.shiftKey) {
          e.preventDefault();
          const next = tree.nextNode;
          tree.focus(next);
        }
        if (e.key === "ArrowDown" && e.shiftKey) {
          e.preventDefault();
          const next = tree.nextNode;
          if (!next) return;
          const current = tree.focusedNode;
          if (!current) {
            tree.focus(tree.firstNode);
          } else if (current.isSelected) {
            tree.focus(next, { select: false });
            tree.select(next, { contiguous: true });
          } else {
            tree.focus(next, { select: false });
            tree.select(next, { multi: true });
          }
        }
        if (e.key === "ArrowUp" && !e.shiftKey) {
          e.preventDefault();
          tree.focus(tree.prevNode);
        }
        if (e.key === "ArrowUp" && e.shiftKey) {
          e.preventDefault();
          const prev = tree.prevNode;
          const current = tree.focusedNode;
          if (!prev) return;
          if (!current) {
            tree.focus(tree.lastNode);
          } else if (current.isSelected) {
            tree.focus(prev, { select: false });
            tree.select(prev, { contiguous: true });
          } else {
            tree.focus(prev, { select: false });
            tree.select(prev, { multi: true });
          }
        }
        if (e.key === "ArrowRight") {
          const node = tree.focusedNode;
          if (!node) return;
          if (node.isInternal && node.isOpen) {
            tree.focus(tree.nextNode);
          } else if (node.isInternal) tree.open(node.id);
        }
        if (e.key === "ArrowLeft") {
          const node = tree.focusedNode;
          if (!node) return;
          if (node.isInternal && node.isOpen) tree.close(node.id);
          else {
            tree.focus(node.parent);
          }
        }
        if (e.key === "a" && e.metaKey) {
          e.preventDefault();
          tree.selectAll();
        }
        if (e.key === "a" && !e.metaKey) {
          tree.newLeafNode();
        }
        if (e.key === "Home") {
          e.preventDefault();
          tree.focus(tree.firstNode);
        }
        if (e.key === "End") {
          e.preventDefault();
          tree.focus(tree.lastNode);
        }
        if (e.key === "Enter") {
          setTimeout(() => {
            if (tree.focusedNode) tree.edit(tree.focusedNode);
          });
        }
        if (e.key === " ") {
          const node = tree.focusedNode;
          if (!node) return;
          node.isLeaf ? node.activate() : node.toggle();
        }
        if (e.key === "*") {
          const node = tree.focusedNode;
          if (!node) return;
          tree.openSiblings(node);
        }

        // If they type a sequence of characters
        // collect them. Reset them after a timeout.
        // Use it to search the tree for a node, then focus it.
        // Clean this up a bit later
        clearTimeout(timeoutId);
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
      }}
    >
      <FixedSizeList
        className={tree.props.className}
        outerRef={tree.listEl}
        itemCount={tree.visibleNodes.length}
        height={tree.height}
        width={tree.width}
        itemSize={tree.rowHeight}
        itemKey={(index) => tree.visibleNodes[index]?.id || index}
        outerElementType={ListOuterElement}
        ref={tree.list}
      >
        {RowContainer}
      </FixedSizeList>
    </div>
  );
}
