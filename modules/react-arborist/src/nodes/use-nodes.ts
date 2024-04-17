import { useState } from "react";
import {
  Accessors,
  NodeObject,
  NodeType,
  NodesOnChangeEvent,
  NodesPartialController,
} from "./types.js";
import { TreeModel } from "./tree-model.js";

export function useNodes<T>(
  initialData: T[],
  options: Partial<Accessors<T>> = {},
) {
  const [sourceData, setSourceData] = useState(initialData);
  const treeManager = new TreeModel(sourceData, options);

  return {
    setSourceData,
    initialize: (args: { nodeType: NodeType }) => treeManager.initialize(args),
    value: treeManager.nodes as NodeObject<T>[],
    onChange: (event: NodesOnChangeEvent<T>) => {
      switch (event.type) {
        case "create":
          treeManager.create(event);
          break;
        case "move":
          treeManager.move(event);
          break;
        case "update":
          treeManager.update(event);
          break;
        case "destroy":
          treeManager.destroy(event);
          break;
      }
      setSourceData([...treeManager.sourceData]);
    },
  };
}
