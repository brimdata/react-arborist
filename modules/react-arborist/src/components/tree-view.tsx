import React, { forwardRef, useContext, useRef } from "react";
import { TreeController } from "../controllers/tree-controller.js";
import { TreeViewProps } from "../types/tree-view-props.js";
import { FixedSizeList } from "react-window";
import { NodeController } from "../controllers/node-controller.js";
import { createRowAttributes } from "../row/attributes.js";
import { DefaultCursorRenderer } from "./default-cursor.js";
import { useCursorProps } from "../cursor/use-cursor-props.js";
import { useCursorContainerStyle } from "../cursor/use-cursor-container-style.js";
import { useListInnerStyle } from "../list/use-list-inner-style.js";
import { useNodeDrag } from "../dnd/use-node-drag.js";
import { useNodeDrop } from "../dnd/use-node-drop.js";
import { useDefaultProps } from "../props/use-default-props.js";
import { useRowFocus } from "../focus/use-row-focus.js";
import { createTreeViewAttributes } from "../tree-view/attributes.js";
import { useTreeDrop } from "../dnd/use-tree-drop.js";
import { NodeRendererProps, RowRendererProps } from "../types/renderers.js";

export function TreeView<T>(props: Partial<TreeViewProps<T>>) {
  const filledProps = useDefaultProps(props);
  const tree = new TreeController<T>(filledProps);
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
    <Context.Provider value={props.tree as TreeController<T>}>
      {props.children}
    </Context.Provider>
  );
}

export function useTree<T>(): TreeController<T> {
  const value = useContext(Context);
  if (!value) throw new Error("No context provided");
  return value;
}

function TreeViewContainer() {
  const tree = useTree();
  const attrs = createTreeViewAttributes(tree);
  const outerRef = useRef();
  const dropProps = useTreeDrop(tree, outerRef);

  return (
    <div {...attrs} ref={(node) => (tree.element = node)} {...dropProps}>
      {/* @ts-ignore */}
      <FixedSizeList
        className={tree.props.className}
        itemCount={tree.rows.length}
        height={tree.height}
        width={tree.width}
        itemSize={tree.rowHeight}
        overscanCount={tree.overscanCount}
        itemKey={(index) => tree.rows[index]?.id || index}
        outerElementType={ListOuter as any}
        outerRef={outerRef}
        innerElementType={ListInner as any}
        direction={tree.props.direction}
        onScroll={tree.props.onScroll}
        ref={(node) => {
          tree.listElement = node;
          tree.visibleStartIndex;
        }}
      >
        {RowContainer as any}
      </FixedSizeList>
    </div>
  );
}

const ListOuter = forwardRef(function ListOuter(
  { children, ...rest }: any,
  ref,
) {
  return (
    <div {...rest} ref={ref}>
      <CursorContainer />
      {children}
    </div>
  );
});

const ListInner = forwardRef(function ListInner(
  { children, ...rest }: any,
  ref,
) {
  const tree = useTree();
  const style = useListInnerStyle(tree, rest.style);
  return (
    <div {...rest} ref={ref} style={style}>
      {children}
    </div>
  );
});

function CursorContainer() {
  const tree = useTree();
  const style = useCursorContainerStyle(tree);
  const props = useCursorProps(tree);
  if (!props) return null;
  return (
    <div style={style}>
      <DefaultCursorRenderer {...props} />
    </div>
  );
}

function RowContainer<T>(props: { style: React.CSSProperties; index: number }) {
  const tree = useTree<T>();
  const node = tree.rows[props.index];
  const attrs = createRowAttributes(tree, node, props.style);
  const ref = useRef<any>();
  const dropProps = useNodeDrop(node, ref);
  const RowRenderer = tree.props.renderRow;
  useRowFocus(node, ref);

  return (
    <RowRenderer node={node} attrs={{ ...attrs, ...dropProps }} innerRef={ref}>
      <NodeContainer node={node} />
    </RowRenderer>
  );
}

export function DefaultRowRenderer<T>(props: RowRendererProps<T>) {
  return (
    <div
      {...props.attrs}
      onFocus={(e) => e.stopPropagation()}
      ref={props.innerRef}
    >
      {props.children}
    </div>
  );
}

function NodeContainer<T>(props: { node: NodeController<T> }) {
  const { node } = props;
  const indent = node.tree.indent * node.level;
  const style = { paddingInlineStart: indent + 10 };
  const dragProps = useNodeDrag(node);
  const NodeRenderer = node.tree.props.renderNode;

  return (
    <NodeRenderer
      attrs={{ style, ...dragProps }}
      node={node}
      style={style}
      tree={node.tree}
    />
  );
}

export function DefaultNodeRenderer<T>(props: NodeRendererProps<T>) {
  const { node, attrs } = props;

  function onSubmit(e: any) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const changes = Object.fromEntries(data.entries());
    node.submit(changes as Partial<T>);
  }

  function onClick(e: any) {
    if (e.metaKey && e.shiftKey) {
      node.tree.selectAll();
    } else if (e.metaKey) {
      node.isSelected ? node.deselect() : node.selectMulti();
    } else if (e.shiftKey) {
      node.selectContiguous();
    } else {
      node.select();
    }
  }

  let classNames = "";
  for (const key in node.state) {
    if (node.state[key]) classNames += " " + key;
  }

  return (
    <div {...attrs} className={classNames}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          node.toggle();
        }}
      >
        {node.isLeaf ? "" : node.isOpen ? "📂" : "📁"}
      </span>{" "}
      {node.isEditing ? (
        <form onSubmit={onSubmit} style={{ display: "contents" }}>
          <input
            autoFocus
            type="text"
            name="name"
            defaultValue={
              /* @ts-ignore */
              node.data.name
            }
          />
        </form>
      ) : (
        <span style={{ color: node.isSelected ? "red" : "inherit" }}>
          <span onClick={onClick}>
            {
              /* @ts-ignore */
              node.data.name
            }
          </span>
        </span>
      )}
    </div>
  );
}
