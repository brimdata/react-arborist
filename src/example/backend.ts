import { nanoid } from "nanoid";
import { useState, useMemo, useCallback } from "react";
import TreeModel from "tree-model-improved";

function findById(node: any, id: string): TreeModel.Node<any> | null {
  return node.first((n: any) => n.model.id === id);
}

const initData = {
  id: nanoid(),
  name: "Bookmarks",
  isOpen: true,
  children: [
    {
      id: nanoid(),
      name: "Brim Github",
      isOpen: true,
      children: [
        {
          id: nanoid(),
          name: "brim/pulls",
        },
        {
          id: nanoid(),
          name: "zed/pulls",
        },
        {
          id: nanoid(),
          name: "brim/releases",
        },
        {
          id: nanoid(),
          name: "brim/zson",
        },
        {
          id: nanoid(),
          name: "Level 3",
          isOpen: true,
          children: [
            { id: nanoid(), name: "amazon" },
            { id: nanoid(), name: "apple" },
            { id: nanoid(), name: "facebook" },
          ],
        },
      ],
    },
    {
      id: nanoid(),
      name: "Brim Zenhub",
      isOpen: true,
      children: [
        { id: nanoid(), name: "My Issues" },
        { id: nanoid(), name: "Brim All Issues" },
        { id: nanoid(), name: "MVP 0" },
        { id: nanoid(), name: "Manual Brim Test Cases" },
      ],
    },
    {
      id: nanoid(),
      name: "Meetings",
      isOpen: true,
      children: [
        { id: nanoid(), name: "Thursday" },
        { id: nanoid(), name: "Saturday" },
      ],
    },
    {
      id: nanoid(),
      name: "Personal",
      isOpen: true,
      children: [
        { id: nanoid(), name: "Imbox" },
        { id: nanoid(), name: "Facebook Marketplace" },
        { id: nanoid(), name: "Bank of America" },
        { id: nanoid(), name: "Mint" },
        { id: nanoid(), name: "Learn UI Design" },
      ],
    },
  ],
};

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
