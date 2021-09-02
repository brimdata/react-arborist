import { useCallback, useMemo, useState } from "react";
import TreeModel from "tree-model-improved";
import lineage from "./lineage";

function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}

const initData = lineage;

export function useBackend() {
  const [data, setData] = useState(initData);
  const root = useMemo(() => new TreeModel().parse(data), [data]);
  const find = useCallback((id) => findById(root, id), [root]);
  const update = () => setData({ ...root.model });

  return {
    data,
    onMove: (
      srcIds: string[],
      dstParentId: string | null,
      dstIndex: number
    ) => {
      for (const srcId of srcIds) {
        const src = find(srcId);
        const dstParent = dstParentId ? find(dstParentId) : root;
        if (!src || !dstParent) return;
        const newItem = new TreeModel().parse(src.model);
        dstParent.addChildAtIndex(newItem, dstIndex);
        src.drop();
      }
      update();
    },

    onOpen: (id: string) => {
      const node = find(id);
      if (node) {
        node.model.isOpen = true;
        update();
      }
    },

    onClose: (id: string) => {
      const node = find(id);
      if (node) {
        node.model.isOpen = false;
        update();
      }
    },

    onRename: (id: string, name: string) => {
      const node = find(id);
      if (node) {
        node.model.name = name;
        update();
      }
    },
  };
}
