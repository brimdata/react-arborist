import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { SimpleTree } from "./simple-tree";

type Data = { id: string; name: string; children?: Data[] };

export function useTreeController(initialData: Data[]) {
  const [data, setData] = useState(initialData);
  const tree = useMemo(() => new SimpleTree<Data>(data), [data]);

  function move(args: { dragIds: string[]; parentId: string; index: number }) {
    for (const id of args.dragIds) {
      tree.move({ id, parentId: args.parentId, index: args.index });
    }
    setData(tree.data);
  }

  function rename(args: { id: string; name: string }) {
    tree.update({ id: args.id, changes: { name: args.name } });
    setData(tree.data);
  }

  function create({ parentId, index }: { parentId: string; index: number }) {
    const data: Data = { id: nanoid(), name: "new item" };
    tree.create({ parentId, index, data });
    setData(tree.data);
    return data;
  }

  function drop(args: { id: string }) {
    tree.drop(args);
    setData(tree.data);
  }

  const controller = { move, rename, create, drop };

  return [data, controller] as const;
}
