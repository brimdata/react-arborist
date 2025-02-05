import { useState } from "react";
import {
  Accessors,
  NodeObject,
  NodeType,
  NodesOnChangeEvent,
} from "./types.js";
import { TreeModel } from "./tree-model.js";

export function useNodes<T>(
  initialData: T[],
  options: Partial<Accessors<T>> = {},
) {
  const [sourceData, setSourceData] = useState(initialData);
  const tree = new TreeModel(sourceData, options);

  return {
    setSourceData,
    setChildren: (id: string, children: T[]) => {
      tree.find(id)?.setChildren(children);
      setSourceData([...tree.sourceData]);
    },
    initialize: (args: { nodeType: NodeType }) => tree.initialize(args),
    value: tree.nodes as NodeObject<T>[],
    onChange: (event: NodesOnChangeEvent<T>) => {
      switch (event.type) {
        case "create":
          tree.create(event);
          break;
        case "move":
          tree.move(event);
          break;
        case "update":
          tree.update(event);
          break;
        case "destroy":
          tree.destroy(event);
          break;
      }
      setSourceData([...tree.sourceData]);
    },
  };
}
