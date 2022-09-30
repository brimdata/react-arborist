import { useCallback, useMemo, useState } from "react";
import TreeModel from "tree-model-improved";

function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}

export function useTreeController<T>(initialData: T) {
  const [data, setData] = useState(initialData);
  // @ts-ignore
  const root = useMemo(() => new TreeModel().parse(data), [data]);
  // @ts-ignore
  const find = useCallback((id) => findById(root, id), [root]);
  const update = () => setData({ ...root.model });

  function move(
    srcIds: string[],
    dstParentId: string | null,
    dstIndex: number
  ) {
    for (const srcId of srcIds) {
      const src = find(srcId);
      const dstParent = dstParentId ? find(dstParentId) : root;
      if (!src || !dstParent) return;
      const newItem = new TreeModel().parse(src.model);
      dstParent.addChildAtIndex(newItem, dstIndex);
      src.drop();
    }
    update();
  }

  function rename(id: string, name: string) {
    const node = find(id);
    if (node) {
      node.model.name = name;
      update();
    }
  }

  function create({ parentId, index }: { parentId: string; index: number }) {
    const dstParent = find(parentId);
    if (!dstParent) return null;
    const data = { id: "100", name: "" };
    const newItem = new TreeModel().parse({ id: "100", name: "" });
    dstParent.addChildAtIndex(newItem, index);
    update();
    return data;
  }

  const controller = { move, rename, create };

  return [data, controller] as const;
}
