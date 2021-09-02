import React from "react";
import { TreeList } from "../lib";
import "./app.css";
import { useBackend } from "./backend";
import { Node } from "./node";
// @ts-ignore
import useDimensions from "react-use-dimensions";

export default function App() {
  const backend = useBackend();
  const [ref, { width, height }] = useDimensions();

  return (
    <div className="example">
      <aside ref={ref}>
        <TreeList
          hideRoot
          className="react-tree-list"
          onMove={backend.onMove}
          onOpen={backend.onOpen}
          onClose={backend.onClose}
          onRename={backend.onRename}
          indent={24}
          rowHeight={22}
          data={backend.data}
          width={width}
          height={height || 100}
        >
          {Node}
        </TreeList>
      </aside>
      <main>
        <h1>React Arborist</h1>
      </main>
    </div>
  );
}
