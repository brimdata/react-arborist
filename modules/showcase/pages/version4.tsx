import { TreeView, useNodes } from "react-arborist";
import { gmailData } from "../data/gmail";
import { useState } from "react";

export default function Version4() {
  const nodes = useNodes(gmailData, {
    id: (d) => d.id,
    isLeaf: (d) => !d.children,
  });

  const [opensValue, setOpens] = useState({});
  // return <p>Reset</p>;
  return (
    <div>
      {
        <TreeView
          nodes={nodes}
          opens={{
            value: opensValue,
            onChange: (e) => {
              setOpens(e.value);
            },
          }}
        />
      }
    </div>
  );
}
