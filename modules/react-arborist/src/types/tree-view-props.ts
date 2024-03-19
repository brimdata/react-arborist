import { NodesPartialController } from "../nodes/types";
import { OpensPartialController } from "../opens/types";
import { PartialController } from "./utils";
import { EditOnChangeEvent, EditPartialController } from "../edit/types";
import { SelectionPartialController } from "../selection/types";
import { DndPartialController } from "../dnd/types";
import { CursorPartialController } from "../cursor/types";

export type TreeViewProps<T> = {
  /* Partial Controllers */
  nodes: NodesPartialController<T>;
  opens: OpensPartialController;
  edit: EditPartialController;
  selection: SelectionPartialController<T>;
  dnd: DndPartialController<T>;
  cursor: CursorPartialController;

  /* Dimensions and Sizes */
  width: number | string;
  height: number;
  rowHeight: number;
  indent: number;
  overscanCount: number;
  paddingTop: number;
  paddingBottom: number;
  padding: number;

  /* Class Names */
  className?: string | undefined;
  rowClassName?: string | undefined;

  /* Configurations */
  openByDefault?: boolean;
};
