import { ForwardedRef, forwardRef, ReactElement, useMemo, useRef } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FixedSizeList } from "react-window";
import { TreeViewProvider, useStaticContext } from "../context";
import { computeDrop } from "../dnd/compute-drop";
import { setCursorLocation } from "../reducer";
import { TreeViewHandle, TreeViewProps } from "../types";
import { enrichTree, flattenTree, noop } from "../utils";
import { Preview } from "./preview";
import { Row } from "./row";

function TreeListComponent(
  props: TreeViewProps,
  ref: ForwardedRef<TreeViewHandle>
) {
  const root = useMemo(
    () => enrichTree(props.data, props.hideRoot),
    [props.data, props.hideRoot]
  );
  const visibleNodes = useMemo(() => flattenTree(root), [root]);
  const listRef = useRef<HTMLDivElement | null>(null);

  return (
    <TreeViewProvider
      handle={ref}
      visibleNodes={visibleNodes}
      listRef={listRef}
      renderer={props.children}
      width={props.width}
      height={props.height}
      indent={props.indent || 12}
      rowHeight={props.rowHeight || 24}
      onClose={props.onClose || noop}
      onMove={props.onMove || noop}
      onOpen={props.onOpen || noop}
      onRename={props.onRename || noop}
    >
      <DndProvider backend={HTML5Backend}>
        <OuterDrop>
          <List className={props.className} />
        </OuterDrop>
        <Preview />
      </DndProvider>
    </TreeViewProvider>
  );
}

function OuterDrop(props: { children: ReactElement }) {
  const treeList = useStaticContext();

  // In case we drop an item at the bottom of the list
  const [, drop] = useDrop(
    () => ({
      accept: "NODE",
      hover: (item, m) => {
        if (!m.isOver({ shallow: true })) return;
        const offset = m.getClientOffset();
        if (!treeList.listRef.current || !offset) return;
        const { cursor } = computeDrop({
          element: treeList.listRef.current,
          offset: offset,
          indent: treeList.indent,
          node: null,
          prevNode: treeList.visibleNodes[treeList.visibleNodes.length - 1],
          nextNode: null,
        });
        treeList.dispatch(setCursorLocation(cursor));
      },
      drop: (item, m) => {
        if (m.didDrop()) return;
        console.log("drop!!");
        const offset = m.getClientOffset();
        if (!treeList.listRef.current || !offset) return;
        const { parentId, index } = computeDrop({
          element: treeList.listRef.current,
          offset: offset,
          indent: treeList.indent,
          node: null,
          prevNode: treeList.visibleNodes[treeList.visibleNodes.length - 1],
          nextNode: null,
        });
        return { parentId, index };
      },
    }),
    [treeList]
  );

  drop(treeList.listRef);

  return props.children;
}

function List(props: { className?: string }) {
  const treeList = useStaticContext();
  return (
    <FixedSizeList
      className={props.className}
      outerRef={treeList.listRef}
      itemCount={treeList.visibleNodes.length}
      height={treeList.height}
      width={treeList.width}
      itemSize={treeList.rowHeight}
    >
      {Row}
    </FixedSizeList>
  );
}

export const TreeList = forwardRef(TreeListComponent);
