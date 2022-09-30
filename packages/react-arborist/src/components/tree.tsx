import { forwardRef } from "react";
import { TreeProvider } from "./provider";
import { TreeApi } from "../interfaces/tree-api";
import { OuterDrop } from "./outer-drop";
import { TreeContainer } from "./tree-container";
import { DragPreviewContainer } from "./drag-preview-container";
import { TreeProps } from "../types/tree-props";
import { IdObj } from "../types/utils";

export const Tree = forwardRef(function Tree<T extends IdObj>(
  props: TreeProps<T>,
  ref: React.Ref<TreeApi<T>>
) {
  return (
    <TreeProvider treeProps={props} imperativeHandle={ref}>
      <OuterDrop>
        <TreeContainer />
      </OuterDrop>
      <DragPreviewContainer />
    </TreeProvider>
  );
});
