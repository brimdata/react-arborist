import { FixedSizeList } from "react-window";
import { useTreeApi } from "../context";
import { focusNextElement, focusPrevElement } from "../utils";
import { ListOuterElement } from "./list-outer-element";
import { RowContainer } from "./row-container";

let focusSearchTerm = "";
let timeoutId: any = null;

// Move this to default container
export function List(props: { className?: string }) {
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
        if (e.key === "Tab" && !e.shiftKey) {
          e.preventDefault();
          focusNextElement(e.currentTarget);
        }
        if (e.key === "Tab" && e.shiftKey) {
          e.preventDefault();
          focusPrevElement(e.currentTarget);
        }
        if (e.key === "ArrowDown" && !e.shiftKey) {
          tree.focus(tree.nextNode);
        }
        if (e.key === "ArrowDown" && e.shiftKey) {
          const next = tree.nextNode;
          const current = tree.focusedNode;
          if (!current) {
            tree.focus(tree.firstNode);
          } else if (current.isSelected) {
            tree.focus(next);
            tree.select(next, { contiguous: true });
          } else {
            tree.focus(next);
            tree.select(next, { multi: true });
          }
        }
        if (e.key === "ArrowUp" && !e.shiftKey) {
          tree.focus(tree.prevNode);
        }
        if (e.key === "ArrowUp" && e.shiftKey) {
          const prev = tree.prevNode;
          const current = tree.focusedNode;
          if (!current) {
            tree.focus(tree.lastNode);
          } else if (current.isSelected) {
            tree.focus(prev);
            tree.select(prev, { contiguous: true });
          } else {
            tree.focus(prev);
            tree.select(prev, { multi: true });
          }
        }
        if (e.key === "ArrowRight") {
          const node = tree.focusedNode;
          if (!node) return;
          if (node.isInternal && node.isOpen) tree.focusNext();
          else if (node.isInternal) tree.open(node.id);
        }
        if (e.key === "ArrowLeft") {
          const node = tree.focusedNode;
          if (!node) return;
          if (node.isInternal && node.isOpen) tree.close(node.id);
          else if (node.parent) tree.focus(node.parent.id);
        }
        if (e.key === "a" && e.metaKey) {
          e.preventDefault();
          tree.selectAll();
        }
        if (e.key === "Home") {
          if (tree.firstNode) tree.focus(tree.firstNode.id);
        }
        if (e.key === "End") {
          if (tree.lastNode) tree.focus(tree.lastNode.id);
        }
        if (e.key === "Enter") {
          setTimeout(() => {
            if (tree.focusedNode) tree.edit(tree.focusedNode.id);
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
        className={props.className}
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
function focusPreviousElement(currentTarget: EventTarget & HTMLDivElement) {
  throw new Error("Function not implemented.");
}
