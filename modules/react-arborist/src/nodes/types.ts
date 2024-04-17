import { PartialController } from "../types/utils.js";

export type NodeObject<T> = {
  id: string;
  sourceData: T;
  children: NodeObject<T>[] | null;
  parent: NodeObject<T> | null;
  isLeaf: boolean;
  level: number;
  childIndex: number;
};

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
> & { initialize: (args: { nodeType: NodeType }) => T };

export type GetSortField<T> = (d: T) => number | string | boolean;

export type SortOrder = "asc" | "desc";

export type Initializer<T> = (args: { nodeType: NodeType }) => T;

export type NodeType = "leaf" | "internal";

export type Accessors<T> = {
  id: (d: T) => string;
  children: (d: T) => T[] | null;
  isLeaf: (d: T) => boolean;
  initialize: Initializer<T>;
  sortBy: GetSortField<T> | GetSortField<T>[];
  sortOrder: SortOrder | SortOrder[];
};
