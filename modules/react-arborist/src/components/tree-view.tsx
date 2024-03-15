import React, {
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  useContext,
} from "react";
import { TreeController } from "../controllers/tree-controller";
import { TreeViewProps } from "../types/tree-view-props";
import { FixedSizeList } from "react-window";
import { NodeController } from "../controllers/node-controller";
import { createRowAttributes } from "../row/attributes";
import { useRowDragAndDrop } from "../row/drag-and-drop";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export function TreeView<T>(props: TreeViewProps<T>) {
  const tree = new TreeController<T>(props);
  return (
    <TreeViewProvider tree={tree}>
      <TreeViewContainer />
    </TreeViewProvider>
  );
}

const Context = React.createContext<TreeController<any> | null>(null);

function TreeViewProvider<T>(props: {
  tree: TreeController<T>;
  children: any;
}) {
  return (
    <Context.Provider value={props.tree}>
      <DndProvider backend={HTML5Backend}>{props.children}</DndProvider>
    </Context.Provider>
  );
}

export function useTree() {
  const value = useContext(Context);
  if (!value) throw new Error("No context provided");
  return value;
}

function TreeViewContainer() {
  const tree = useTree();
  return (
    <div role="tree">
      <FixedSizeList
        // className={tree.props.className}
        // outerRef={tree.listEl}
        itemCount={tree.rows.length}
        height={tree.height}
        width={tree.width}
        itemSize={tree.rowHeight}
        overscanCount={tree.overscanCount}
        itemKey={(index) => tree.rows[index]?.id || index}
        // outerElementType={ListOuterElement}
        // innerElementType={ListInnerElement}
        // onScroll={tree.props.onScroll}
        // onItemsRendered={tree.onItemsRendered.bind(tree)}
        // ref={tree.list}
      >
        {RowContainer}
      </FixedSizeList>
    </div>
  );
}

function RowContainer<T>(props: { style: React.CSSProperties; index: number }) {
  const tree = useTree();
  const node = tree.rows[props.index];
  const indent = tree.indent * node.level;
  const nodeStyle = { paddingLeft: indent };
  const attrs = createRowAttributes(tree, node, props.style);
  const { dragRef, innerRef } = useRowDragAndDrop(node);
  return (
    <RowRenderer node={node} attrs={attrs} innerRef={innerRef}>
      <NodeRenderer
        style={nodeStyle}
        dragHandle={dragRef}
        node={node}
        tree={tree}
      />
    </RowRenderer>
  );
}

export function RowRenderer<T>(props: {
  node: NodeController<T>;
  attrs: HTMLAttributes<any>;
  innerRef: (el: HTMLDivElement | null) => void;
  children: ReactElement;
}) {
  return (
    <div
      {...props.attrs}
      ref={props.innerRef}
      onFocus={(e) => e.stopPropagation()}
      // onClick={commands.bind("row-click")}
    >
      {props.children}
    </div>
  );
}

function NodeRenderer(props: {
  style: CSSProperties;
  node: NodeController<T>;
  tree: TreeController<T>;
  dragHandle?: (el: HTMLDivElement | null) => void;
  preview?: boolean;
}) {
  return (
    <div ref={props.dragHandle} style={props.style}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          console.log("click");
          props.node.toggle();
        }}
      >
        {props.node.isLeaf ? "🌳" : props.node.isOpen ? "🗁" : "🗀"}
      </span>{" "}
      <span>{props.node.data.name}</span>
    </div>
  );
}
