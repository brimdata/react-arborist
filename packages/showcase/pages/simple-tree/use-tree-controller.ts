import { useCallback, useMemo, useState } from "react";
import TreeModel from "tree-model-improved";
import { nanoid } from "nanoid";

function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}

export function useTreeController<T>(initialData: T) {
  const [data, setData] = useState(initialData);
  const root = useMemo(() => {
    // @ts-ignore
    return new TreeModel().parse(data);
  }, [data]);
  // @ts-ignore
  const find = useCallback((id: string) => findById(root, id), [root]);
  const update = () => setData({ ...root.model });

  function move(args: {
    dragIds: string[];
    parentId: string | null;
    index: number;
  }) {
    for (const srcId of args.dragIds) {
      const src = find(srcId);
      const dstParent = args.parentId ? find(args.parentId) : root;
      if (!src || !dstParent) return;
      const newItem = new TreeModel().parse(src.model);
      dstParent.addChildAtIndex(newItem, args.index);
      src.drop();
    }
    update();
  }

  function rename(args: { id: string; name: string }) {
    const node = find(args.id);
    if (node) {
      node.model.name = args.name;
      update();
    }
  }

  function create({ parentId, index }: { parentId: string; index: number }) {
    const dstParent = find(parentId);
    if (!dstParent) return null;
    const data = { id: nanoid(), name: "" };
    const newItem = new TreeModel().parse(data);
    console.log("Adding at index", index);
    dstParent.addChildAtIndex(newItem, index);
    update();
    return data;
  }

  const controller = { move, rename, create };

  return [data, controller] as const;
}
