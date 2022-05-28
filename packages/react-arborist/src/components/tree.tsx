import { forwardRef, ReactElement, useMemo, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { enrichTree } from "../data/enrich-tree";
import { TreeViewProvider } from "../provider";
import { TreeApi } from "../tree-api";
import { IdObj, Node, TreeProps } from "../types";
import { noop } from "../utils";
import { Preview } from "./preview";
import { OuterDrop } from "./outer-drop";
import { List } from "./list";

export const Tree = forwardRef(function Tree<T extends IdObj>(
  props: TreeProps<T>,
  ref: React.Ref<TreeApi<T>>
) {
  const root = useMemo<Node<T>>(
    () =>
      enrichTree<T>(
        props.data,
        props.hideRoot,
        props.getChildren,
        props.isOpen,
        props.disableDrag,
        props.disableDrop,
        props.openByDefault
      ),
    [
      props.data,
      props.hideRoot,
      props.getChildren,
      props.isOpen,
      props.disableDrag,
      props.disableDrop,
      props.openByDefault,
    ]
  );

  return (
    <TreeViewProvider
      imperativeHandle={ref}
      root={root}
      listEl={useRef<HTMLDivElement | null>(null)}
      renderer={props.children}
      width={props.width === undefined ? 300 : props.width}
      height={props.height === undefined ? 500 : props.height}
      indent={props.indent === undefined ? 24 : props.indent}
      rowHeight={props.rowHeight === undefined ? 24 : props.rowHeight}
      onMove={props.onMove || noop}
      onToggle={props.onToggle || noop}
      onEdit={props.onEdit || noop}
      onClick={props.onClick}
      onContextMenu={props.onContextMenu}
    >
      <DndProvider
        backend={HTML5Backend}
        options={{ rootElement: props.dndRootElement || undefined }}
      >
        <OuterDrop>
          <List className={props.className} />
        </OuterDrop>
        <Preview />
      </DndProvider>
    </TreeViewProvider>
  );
});
