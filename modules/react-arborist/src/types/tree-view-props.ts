import { NodeObject } from "./node-object";
import { NodesOnChangeEvent } from "./nodes-partial-controller";
import { PartialController } from "./utils";

export type TreeViewProps<T> = {
  nodes: PartialController<NodeObject<T>[], NodesOnChangeEvent<T>>;
};
