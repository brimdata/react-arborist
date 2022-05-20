import React from "react";
// @ts-ignore
import AutoSize from "react-virtualized-auto-sizer";
import { Tree, TreeApi } from "react-arborist";
import { Node } from "./node";
import { useBackend } from "./backend";

export function GotLineage() {
  const backend = useBackend();
  return (
    <AutoSize>
      {(props: any) => (
        <Tree
          ref={(tree: TreeApi) => {
            // @ts-ignore
            global.tree = tree;
          }}
          className="react-aborist"
          data={backend.data}
          getChildren="children"
          isOpen="isOpen"
          disableDrop={(d) => d.name === "House Arryn"}
          hideRoot
          indent={24}
          onMove={backend.onMove}
          onToggle={backend.onToggle}
          onEdit={backend.onEdit}
          rowHeight={22}
          width={props.width}
          height={props.height}
          onSelect={(data) => {
            console.log("An item was selected", data.name);
          }}
        >
          {Node}
        </Tree>
      )}
    </AutoSize>
  );
}
