export type CreatePayload<T> = {
  parentId: string | null;
  index: number;
  data: T;
};

export type UpdatePayload<T> = {
  id: string;
  changes: Partial<T>;
};

export type MovePayload<T> = {
  dragIds: string[];
  parentId: string | null;
  index: number;
};

export type DestroyPayload<T> = {
  ids: string[];
};

export type NodesOnChangeEvent<T> =
  | { type: "create"; payload: CreatePayload<T> }
  | { type: "update"; payload: UpdatePayload<T> }
  | { type: "move"; payload: MovePayload<T> }
  | { type: "destroy"; payload: DestroyPayload<T> };
