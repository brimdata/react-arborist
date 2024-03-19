import { PartialController } from "../types/utils";
import { NodeObject } from "./node-object";

export type CreateEvent<T> = {
  type: "create";
  parentId: string | null;
  index: number;
  data: T;
};

export type UpdateEvent<T> = {
  type: "update";
  id: string;
  changes: Partial<T>;
};

export type MoveEvent<T> = {
  type: "move";
  sourceIds: string[];
  targetParentId: string | null;
  targetIndex: number;
};

export type DestroyEvent<T> = {
  type: "destroy";
  ids: string[];
};

export type NodesOnChangeEvent<T> =
  | CreateEvent<T>
  | UpdateEvent<T>
  | MoveEvent<T>
  | DestroyEvent<T>;

export type NodesState<T> = NodeObject<T>[];
export type NodesPartialController<T> = PartialController<
  NodesState<T>,
  NodesOnChangeEvent<T>
>;
