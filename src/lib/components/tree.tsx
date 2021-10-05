import { ReactElement, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FixedSizeList } from "react-window";
import { useStaticContext } from "../context";
import { useVisibleNodes } from "../data/visible-nodes-hook";
import { useOuterDrop } from "../dnd/outer-drop-hook";
import { TreeViewProvider } from "../provider";
import { IdObj, TreeProps } from "../types";
import { noop } from "../utils";
import { Preview } from "./preview";
import { Row } from "./row";

export function Tree<T extends IdObj>(props: TreeProps<T>) {
  return (
    <TreeViewProvider
      visibleNodes={useVisibleNodes<T>(props)}
      listRef={useRef<HTMLDivElement | null>(null)}
      renderer={props.children}
      width={props.width === undefined ? 300 : props.width}
      height={props.height === undefined ? 500 : props.height}
      indent={props.indent === undefined ? 24 : props.indent}
      rowHeight={props.rowHeight === undefined ? 24 : props.rowHeight}
      onMove={props.onMove || noop}
      onToggle={props.onToggle || noop}
      onEdit={props.onEdit || noop}
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
  useOuterDrop();
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
