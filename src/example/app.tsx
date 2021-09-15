import React from "react";
// @ts-ignore
import useDimensions from "react-use-dimensions";
import { Tree } from "../lib";
import "./app.css";
import { useBackend } from "./backend";

export default function App() {
  const backend = useBackend();
  const [ref, { width, height }] = useDimensions();

  return (
    <div className="example">
      <aside ref={ref}>
        <Tree
          className="react-tree-list"
          data={backend.data}
          getChildren={(m) => m.children}
          getIsOpen={(m) => m.isOpen}
          height={height || 100}
          hideRoot
          indent={24}
          onClose={backend.onClose}
          onMove={backend.onMove}
          onOpen={backend.onOpen}
          onRename={backend.onRename}
          rowHeight={22}
          width={width}
        >
          {({ node, indent, props }) => {
            return (
              <div {...props} style={{ ...props.style, paddingLeft: indent }}>
                {node.model.name}
              </div>
            );
          }}
        </Tree>
      </aside>
      <main>
        <h1>React Arborist</h1>
      </main>
    </div>
  );
}
