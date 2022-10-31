import { useMemo, useState } from "react";
import { SimpleTree } from "../data/simple-tree";
import {
  CreateHandler,
  DeleteHandler,
  MoveHandler,
  RenameHandler,
} from "../types/handlers";
import { IdObj } from "../types/utils";

export type SimpleTreeData = {
  id: string;
  name: string;
  children?: SimpleTreeData[];
};

let nextId = 0;

export function useSimpleTree<T>(initialData: T[]) {
  const [data, setData] = useState(initialData);
  const tree = useMemo(
    () =>
      new SimpleTree<// @ts-ignore
      T>(data),
    [data]
  );

  const onMove: MoveHandler<T> = (args: {
    dragIds: string[];
    parentId: null | string;
    index: number;
  }) => {
    for (const id of args.dragIds) {
      tree.move({ id, parentId: args.parentId, index: args.index });
    }
    setData(tree.data);
  };

  const onRename: RenameHandler<T> = ({ name, id }) => {
    tree.update({ id, changes: { name } as any });
    setData(tree.data);
  };

  const onCreate: CreateHandler<T> = ({ parentId, index, type }) => {
    const data = { id: `simple-tree-id-${nextId++}`, name: "" } as any;
    if (type === "internal") data.children = [];
    tree.create({ parentId, index, data });
    setData(tree.data);
    return data;
  };

  const onDelete: DeleteHandler<T> = (args: { ids: string[] }) => {
    args.ids.forEach((id) => tree.drop({ id }));
    setData(tree.data);
  };

  const controller = { onMove, onRename, onCreate, onDelete };

  return [data, controller] as const;
}
