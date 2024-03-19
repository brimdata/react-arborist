import { useState } from "react";
import { SourceDataAccessors } from "./source-data-accessor";
import { TreeManager } from "./tree-manager";
import { NodesOnChangeEvent, NodesPartialController } from "./types";
import { NodeObject } from "./node-object";

export function useNodes<T>(
  initialData: T[],
  options: Partial<SourceDataAccessors<T>> = {},
) {
  const [sourceData, setSourceData] = useState(initialData);
  const treeManager = new TreeManager(sourceData, options);

  return {
    setSourceData,
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
          console.log(event);
          treeManager.update(event);
          break;
        case "destroy":
          treeManager.destroy(event);
          break;
      }
      setSourceData([...treeManager.sourceData]);
    },
  } as NodesPartialController<T>;
}
