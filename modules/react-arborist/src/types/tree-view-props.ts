import { NodeObject } from "../nodes/node-object";
import { NodesOnChangeEvent } from "../nodes/change-event";
import { OpensOnChangeEvent } from "../opens/change-event";
import { PartialController } from "./utils";
import { EditOnChangeEvent } from "../edit/change-event";
import { SelectionPartialController } from "../selection/types";

export type TreeViewProps<T> = {
  /* Partial Controllers */
  nodes: PartialController<NodeObject<T>[], NodesOnChangeEvent<T>>;
  opens: PartialController<Record<string, boolean>, OpensOnChangeEvent>;
  edit: PartialController<string | null, EditOnChangeEvent>;
  selection: SelectionPartialController<T>;

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
