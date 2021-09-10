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

function TreeComponent(
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
  const tree = useStaticContext();

  // In case we drop an item at the bottom of the list
  const [, drop] = useDrop(
    () => ({
      accept: "NODE",
      hover: (item, m) => {
        if (!m.isOver({ shallow: true })) return;
        const offset = m.getClientOffset();
        if (!tree.listRef.current || !offset) return;
        const { cursor } = computeDrop({
          element: tree.listRef.current,
          offset: offset,
          indent: tree.indent,
          node: null,
          prevNode: tree.visibleNodes[tree.visibleNodes.length - 1],
          nextNode: null,
        });
        tree.dispatch(setCursorLocation(cursor));
      },
      drop: (item, m) => {
        if (m.didDrop()) return;
        console.log("drop!!");
        const offset = m.getClientOffset();
        if (!tree.listRef.current || !offset) return;
        const { parentId, index } = computeDrop({
          element: tree.listRef.current,
          offset: offset,
          indent: tree.indent,
          node: null,
          prevNode: tree.visibleNodes[tree.visibleNodes.length - 1],
          nextNode: null,
        });
        return { parentId, index };
      },
    }),
    [tree]
  );

  drop(tree.listRef);

  return props.children;
}

function List(props: { className?: string }) {
  const tree = useStaticContext();
  return (
    <FixedSizeList
      className={props.className}
      outerRef={tree.listRef}
      itemCount={tree.visibleNodes.length}
      height={tree.height}
      width={tree.width}
      itemSize={tree.rowHeight}
    >
      {Row}
    </FixedSizeList>
  );
}

export const Tree = forwardRef(TreeComponent);
