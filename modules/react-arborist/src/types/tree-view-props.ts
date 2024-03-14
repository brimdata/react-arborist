import { NodeObject } from "../nodes/node-object";
import { NodesOnChangeEvent } from "./nodes-partial-controller";
import { PartialController } from "./utils";

export type TreeViewProps<T> = {
  /* Partial Controllers */
  nodes: PartialController<NodeObject<T>[], NodesOnChangeEvent<T>>;

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
};
