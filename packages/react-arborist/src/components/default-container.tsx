import { FixedSizeList } from "react-window";
import { useDataUpdates, useTreeApi } from "../context";
import { focusNextElement, focusPrevElement } from "../utils";
import { ListOuterElement } from "./list-outer-element";
import { ListInnerElement } from "./list-inner-element";
import { RowContainer } from "./row-container";
import { ContainerProps } from "../types/renderers";

let focusSearchTerm = "";
let timeoutId: any = null;

/**
 * All these keyboard shortcuts seem like they should be configurable.
 * Each operation should be a given a name and separated from
 * the event handler. Future clean up welcome.
 */
export function DefaultContainer({
  shortcutHandlers
}: ContainerProps) {
  useDataUpdates();
  const tree = useTreeApi();
  return (
    <div
      role="tree"
      style={{
        height: tree.height,
        width: tree.width,
        minHeight: 0,
        minWidth: 0,
      }}
      onContextMenu={tree.props.onContextMenu}
      onClick={tree.props.onClick}
      tabIndex={0}
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
        if (tree.isEditing) {
          return;
        }

        Object.values(shortcutHandlers).find(handler => handler.shortcut(e))?.function(tree, e);

        // Focus Next Element
        if (e.key === "Tab" && !e.shiftKey) {
          e.preventDefault();
          focusNextElement(e.currentTarget);
          return;
        }
        // Focus Previous Element
        if (e.key === "Tab" && e.shiftKey) {
          e.preventDefault();
          focusPrevElement(e.currentTarget);
          return;
        }
        // Select Up Tree
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = tree.nextNode;
          if (e.metaKey) {
            tree.select(tree.focusedNode);
            tree.activate(tree.focusedNode);
            return;
          } else if (!e.shiftKey || tree.props.disableMultiSelection) {
            tree.focus(next);
            return;
          } else {
            if (!next) return;
            const current = tree.focusedNode;
            if (!current) {
              tree.focus(tree.firstNode);
            } else if (current.isSelected) {
              tree.selectContiguous(next);
            } else {
              tree.selectMulti(next);
            }
            return;
          }
        }
        // Select Down Tree
        if (e.key === "ArrowUp") {
        }
        // Open Tree Node
        if (e.key === "ArrowRight") {
          const node = tree.focusedNode;
          if (!node) return;
          if (node.isInternal && node.isOpen) {
            tree.focus(tree.nextNode);
          } else if (node.isInternal) tree.open(node.id);
          return;
        }
        // Close Tree Node
        if (e.key === "ArrowLeft") {
          const node = tree.focusedNode;
          if (!node || node.isRoot) return;
          if (node.isInternal && node.isOpen) tree.close(node.id);
          else if (!node.parent?.isRoot) {
            tree.focus(node.parent);
          }
          return;
        }
        // Select All
        if (e.key === "a" && e.metaKey && !tree.props.disableMultiSelection) {
          e.preventDefault();
          tree.selectAll();
          return;
        }
        // Create Leaf
        if (e.key === "a" && !e.metaKey && tree.props.onCreate) {
          tree.createLeaf();
          return;
        }
        // Create Internal
        if (e.key === "A" && !e.metaKey) {
          if (!tree.props.onCreate) return;
          tree.createInternal();
          return;
        }

        // To Top
        if (e.key === "Home") {
          // add shift keys
          e.preventDefault();
          tree.focus(tree.firstNode);
          return;
        }
        // To Bottom
        if (e.key === "End") {
          // add shift keys
          e.preventDefault();
          tree.focus(tree.lastNode);
          return;
        }
        // Edit Node
        if (e.key === "Enter") {
          const node = tree.focusedNode;
          if (!node) return;
          if (!node.isEditable || !tree.props.onRename) return;
          setTimeout(() => {
            if (node) tree.edit(node);
          });
          return;
        }
        // Toggle
        if (e.key === " ") {
          e.preventDefault();
          const node = tree.focusedNode;
          if (!node) return;
          if (node.isLeaf) {
            node.select();
            node.activate();
          } else {
            node.toggle();
          }
          return;
        }
        // Open Siblings
        if (e.key === "*") {
          const node = tree.focusedNode;
          if (!node) return;
          tree.openSiblings(node);
          return;
        }
        // Scroll up
        if (e.key === "PageUp") {
          e.preventDefault();
          tree.pageUp();
          return;
        }
        // Scroll down
        if (e.key === "PageDown") {
          e.preventDefault();
          tree.pageDown();
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
      {/* @ts-ignore */}
      <FixedSizeList
        className={tree.props.className}
        outerRef={tree.listEl}
        itemCount={tree.visibleNodes.length}
        height={tree.height}
        width={tree.width}
        itemSize={tree.rowHeight}
        overscanCount={tree.overscanCount}
        itemKey={(index) => tree.visibleNodes[index]?.id || index}
        outerElementType={ListOuterElement}
        innerElementType={ListInnerElement}
        onScroll={tree.props.onScroll}
        onItemsRendered={tree.onItemsRendered.bind(tree)}
        ref={tree.list}
      >
        {RowContainer}
      </FixedSizeList>
    </div>
  );
}
