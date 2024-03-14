import React, { useContext } from "react";
import { TreeController } from "../controllers/tree-controller";
import { TreeViewProps } from "../types/tree-view-props";
import { FixedSizeList } from "react-window";
import { RowRendererProps } from "../types/renderers";

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
    <Context.Provider value={props.tree}>{props.children}</Context.Provider>
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
        height={800}
        width={800}
        itemSize={24}
        // height={tree.height}
        // width={tree.width}
        // itemSize={tree.rowHeight}
        // overscanCount={tree.overscanCount}
        // itemKey={(index) => tree.visibleNodes[index]?.id || index}
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
  return <div style={props.style}>{node.object.sourceData.name}</div>;
}
