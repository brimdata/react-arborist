import { TreeView, useNodes, useMultiSelection, useDnd } from "react-arborist";
import { gmailData } from "../data/gmail";
import { useState } from "react";

export default function Version4() {
  const nodes = useNodes(gmailData, {
    id: (d) => d.id,
    isLeaf: (d) => !d.children,
  });
  const [opensValue, setOpens] = useState({});
  const [editValue, setEditValue] = useState<string | null>(null);
  const selection = useMultiSelection();
  const [cursor, setCursor] = useState(null);
  const dnd = useDnd();

  return (
    <div>
      {
        <TreeView
          openByDefault
          nodes={nodes}
          selection={selection}
          dnd={dnd}
          cursor={{
            value: cursor,
            onChange: (e) => setCursor(e.value),
          }}
          opens={{
            value: opensValue,
            onChange: (e) => setOpens(e.value),
          }}
          edit={{
            value: editValue,
            onChange: (e) => setEditValue(e.value),
          }}
        />
      }
    </div>
  );
}
