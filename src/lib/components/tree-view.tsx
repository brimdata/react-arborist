import { ForwardedRef, forwardRef, useMemo, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FixedSizeList } from "react-window";
import { TreeViewProvider } from "../context";
import { TreeViewHandle, TreeViewProps } from "../types";
import { enrichTree, flattenTree } from "../utils";
import { Preview } from "./preview";
import { Row } from "./row";

const withDefaults = (props: TreeViewProps): Required<TreeViewProps> => ({
  indent: 12,
  rowHeight: 24,
  onMove: () => {},
  onClose: () => {},
  onOpen: () => {},
  onRename: () => {},
  ...props,
})

function TreeViewC(partialProps: TreeViewProps, ref: ForwardedRef<TreeViewHandle>) {
  const props = withDefaults(partialProps)
  const root = useMemo(() => enrichTree(props.data), [props.data]);
  const list = useMemo(() => flattenTree(root), [root]);
  const listRef = useRef<HTMLDivElement | null>(null);

  return (
    <TreeViewProvider
      handle={ref}
      visibleNodes={list}
      listRef={listRef}
      renderer={props.children}
      {...props}
    >
      <DndProvider backend={HTML5Backend}>
        <Preview />
        <FixedSizeList
          className="tree-view"
          height={props.height}
          width={props.width}
          itemSize={props.rowHeight}
          itemCount={list.length}
          innerRef={listRef}
        >
          {Row}
        </FixedSizeList>
      </DndProvider>
    </TreeViewProvider>
  );
}

export const TreeView = forwardRef(TreeViewC);
