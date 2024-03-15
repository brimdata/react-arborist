import { useState } from "react";
import { SourceDataAccessors } from "./source-data-accessor";
import { TreeManager } from "./tree-manager";
import { NodesOnChangeEvent } from "./change-event";

export function useNodes<T>(
  initialData: T[],
  options: Partial<SourceDataAccessors<T>>,
) {
  const [sourceData, setSourceData] = useState(initialData);
  // console.log("re-render source data", sourceData[0]);
  const treeManager = new TreeManager(sourceData, options);

  return {
    setSourceData,
    value: treeManager.nodes,
    onChange: (event: NodesOnChangeEvent<T>) => {
      switch (event.type) {
        case "create":
          treeManager.create(event.payload);
          break;
        case "move":
          treeManager.move(event.payload);
          break;
        case "update":
          console.log(event);
          treeManager.update(event.payload);
          break;
        case "destroy":
          treeManager.destroy(event.payload);
          break;
      }
      console.log(treeManager.sourceData[0]);
      setSourceData([...treeManager.sourceData]);
    },
  };
}
