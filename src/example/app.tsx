import React from "react";
// @ts-ignore
import useDimensions from "react-use-dimensions";
import { Tree } from "../lib";
import { Node } from "./node";
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
          childrenAccessor="children"
          isOpenAccessor="isOpen"
          height={height || 100}
          hideRoot
          indent={24}
          onMove={backend.onMove}
          onToggle={backend.onToggle}
          onEdit={backend.onEdit}
          rowHeight={22}
          width={width}
        >
          {Node}
        </Tree>
      </aside>
      <main>
        <h1>React Arborist</h1>
      </main>
    </div>
  );
}
