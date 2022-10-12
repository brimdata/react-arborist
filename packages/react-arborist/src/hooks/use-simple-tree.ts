import { useMemo, useState } from "react";
import { SimpleTree } from "../data/simple-tree";
import { isDecendent } from "../utils";

type Data = { id: string; name: string; children?: Data[] };

let nextId = 0;

export function useSimpleTree(initialData: Data[]) {
  const [data, setData] = useState(initialData);
  const tree = useMemo(() => new SimpleTree<Data>(data), [data]);

  function move(args: {
    dragIds: string[];
    parentId: null | string;
    index: number;
  }) {
    for (const id of args.dragIds) {
      tree.move({ id, parentId: args.parentId, index: args.index });
    }
    setData(tree.data);
  }

  function rename(args: { id: string; name: string }) {
    tree.update({ id: args.id, changes: { name: args.name } });
    setData(tree.data);
  }

  function create({
    parentId,
    index,
  }: {
    parentId: string | null;
    index: number;
  }) {
    const data: Data = { id: `simple-tree-id-${nextId++}`, name: "" };
    tree.create({ parentId, index, data });
    setData(tree.data);
    return data;
  }

  function drop(args: { ids: string[] }) {
    args.ids.forEach((id) => tree.drop({ id }));
    setData(tree.data);
  }

  const controller = { move, rename, create, drop };

  return [data, controller] as const;
}
