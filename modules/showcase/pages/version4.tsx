import { TreeView, createTreeManager } from "react-arborist";
import { gmailData } from "../data/gmail";
import { useState } from "react";

export default function Version4() {
  const [sourceData, setSourceData] = useState(gmailData);
  const treeManager = createTreeManager(sourceData, {
    id: (d) => d.id,
    isLeaf: (d) => !d.children,
  });

  return (
    <div>
      <TreeView
        nodes={{
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
                treeManager.update(event.payload);
                break;
              case "destroy":
                treeManager.destroy(event.payload);
                break;
            }
            setSourceData([...treeManager.sourceData]);
          },
        }}
      />
    </div>
  );
}
