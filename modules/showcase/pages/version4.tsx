import { TreeView, useNodes, useFilter } from "react-arborist";
import { gmailData } from "../data/gmail";
import { useState } from "react";

export default function Version4() {
  const [term, setSearchTerm] = useState("");
  const nodes = useNodes(gmailData);
  const filterProps = useFilter(nodes.value, { term });

  return (
    <div className="wrap">
      <div className="region flow">
        <TreeView
          nodes={nodes}
          className="tree"
          rowClassName="tree-row"
          height={100}
          {...filterProps}
        />
        <input
          type="search"
          value={term}
          placeholder="Search tree..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
