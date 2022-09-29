import { forwardRef, ReactElement, useMemo, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TreeViewProvider } from "../provider";
import { TreeApi } from "../tree-api";
import { IdObj, TreeProps } from "../types";
import { Preview } from "./preview";
import { OuterDrop } from "./outer-drop";
import { List } from "./list";

export const Tree = forwardRef(function Tree<T extends IdObj>(
  props: TreeProps<T>,
  ref: React.Ref<TreeApi<T>>
) {
  return (
    <TreeViewProvider treeProps={props} imperativeHandle={ref}>
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
