import React, { useRef } from "react";
// @ts-ignore
import AutoSize from "react-virtualized-auto-sizer";
import { Tree, TreeApi } from "react-arborist";
import { Node } from "./node";
import { MyData, useBackend } from "./backend";
import { CustomCursor } from "./custom-cursor";

export function GotLineage() {
  const backend = useBackend();
  const rootElement = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={rootElement} style={{ height: "100%", width: "100%" }}>
      <AutoSize>
        {(props: any) => (
          <Tree
            ref={(tree) => {
              // @ts-ignore
              global.tree = tree;
            }}
            className="react-aborist"
            data={backend.data}
            getChildren="children"
            isOpen="isOpen"
            disableDrop={(d: MyData) => d.name === "House Arryn"}
            hideRoot
            indent={24}
            onMove={backend.onMove}
            onToggle={backend.onToggle}
            onEdit={backend.onEdit}
            rowHeight={22}
            width={props.width}
            height={props.height}
            onClick={() => console.log("clicked the tree")}
            onContextMenu={() => console.log("context menu the tree")}
            dndRootElement={undefined}
            dropCursor={(props) => <CustomCursor {...props} />}
          >
            {Node}
          </Tree>
        )}
      </AutoSize>
    </div>
  );
}
