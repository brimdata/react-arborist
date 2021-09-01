import React from "react";
import { TreeView } from "../lib";
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
        <TreeView
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
        </TreeView>
      </aside>
      <main>
        <h1>Example Tree List</h1>
      </main>
    </div>
  );
}
