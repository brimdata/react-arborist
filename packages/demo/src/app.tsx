import React from "react";
// @ts-ignore
import AutoSize from "react-virtualized-auto-sizer";
import { Tree, TreeApi } from "react-arborist";
import { Node } from "./node";
import "./app.css";
import { useBackend } from "./backend";

export default function App() {
  const backend = useBackend();

  return (
    <div className="example">
      <aside>
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
              onClick={() => console.log("clicked the tree")}
              onContextMenu={() => console.log("context menu the tree")}
            >
              {Node}
            </Tree>
          )}
        </AutoSize>
      </aside>
      <main>
        <h1>React Arborist</h1>
        <button
          onClick={() => {
            global.tree.edit(21).then(console.log);
          }}
        >
          Edit Id 21
        </button>
      </main>
    </div>
  );
}
